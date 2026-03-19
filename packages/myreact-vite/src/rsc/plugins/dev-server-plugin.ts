/**
 * @file RSC Dev Server Plugin
 * Development server endpoints for RSC streaming and server actions
 * Uses rsc-html-stream for injecting RSC payload into HTML
 */

import type { Plugin, ViteDevServer } from "vite";

export interface DevServerPluginOptions {
  rscEndpoint: string;
  actionEndpoint: string;
}

/**
 * Create the RSC dev server plugin
 */
export function createDevServerPlugin(options: DevServerPluginOptions): Plugin {
  const { rscEndpoint, actionEndpoint } = options;

  return {
    name: "vite:my-react-rsc-dev-server",
    enforce: "pre",

    configureServer(server: ViteDevServer) {
      // RSC endpoint for Flight stream requests (standalone RSC without HTML)
      server.middlewares.use(rscEndpoint, async (req, res, _next) => {
        try {
          // Get the component path from query
          const url = new URL(req.url || "/", `http://${req.headers.host}`);
          const componentPath = url.searchParams.get("component");

          if (!componentPath) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing component parameter" }));
            return;
          }

          // Import and render the component
          const module = await server.ssrLoadModule(componentPath);
          const Component = module.default || module;

          // Use @lazarv/rsc to render to Flight stream
          // eslint-disable-next-line import/no-unresolved
          const { renderToReadableStream } = await import("@lazarv/rsc/server");

          // Get props from request body or query
          let props = {};
          if (req.method === "POST") {
            const body = await readBody(req);
            props = JSON.parse(body);
          }

          const element = { type: Component, props, key: null };
          const stream = renderToReadableStream(element, {
            onError: (error: unknown) => {
              console.error("[@my-react/react-vite] RSC render error:", error);
              return error instanceof Error ? error.message : String(error);
            },
          });

          res.setHeader("Content-Type", "text/x-component");
          res.setHeader("Cache-Control", "no-cache");

          // Pipe the stream to response
          await pipeStream(stream, res);
        } catch (error) {
          console.error("[@my-react/react-vite] RSC endpoint error:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
        }
      });

      // Server action endpoint
      server.middlewares.use(actionEndpoint, async (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }

        try {
          // Get action ID from header (standard RSC way) or query param
          const url = new URL(req.url || "/", `http://${req.headers.host}`);
          const actionId = req.headers["react-server-action"] ? decodeURIComponent(req.headers["react-server-action"] as string) : url.searchParams.get("id");

          if (!actionId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing action ID" }));
            return;
          }

          // Parse module and action name from actionId
          const [modulePath, actionName] = actionId.split("#");

          if (!modulePath || !actionName) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid action ID format" }));
            return;
          }

          // Load the module and get the action
          const module = await server.ssrLoadModule(modulePath);
          const action = module[actionName];

          if (typeof action !== "function") {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `Action "${actionName}" not found` }));
            return;
          }

          // Parse arguments from request body
          const contentType = req.headers["content-type"] || "";
          // eslint-disable-next-line import/no-unresolved
          const { decodeReply } = await import("@lazarv/rsc/server");

          let args: unknown[];
          if (contentType.includes("multipart/form-data")) {
            // Handle FormData
            const formData = await readFormData(req);
            args = (await decodeReply(formData)) as unknown[];
          } else {
            const body = await readBody(req);
            args = (await decodeReply(body)) as unknown[];
          }

          // Execute the action
          const result = await action(...(Array.isArray(args) ? args : [args]));

          // Encode the result using Flight
          // eslint-disable-next-line import/no-unresolved
          const { renderToReadableStream } = await import("@lazarv/rsc/server");
          const stream = renderToReadableStream(result, {
            onError: (error: unknown) => {
              console.error("[@my-react/react-vite] Action error:", error);
              return error instanceof Error ? error.message : String(error);
            },
          });

          res.setHeader("Content-Type", "text/x-component");
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

          // Pipe the stream to response
          await pipeStream(stream, res);
        } catch (error) {
          console.error("[@my-react/react-vite] Action endpoint error:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
        }
      });
    },
  };
}

/**
 * Helper to read request body as string
 */
function readBody(req: { on: (event: string, cb: (data?: unknown) => void) => void }): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: unknown) => {
      body += String(chunk);
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", reject);
  });
}

/**
 * Helper to read request body as FormData (for multipart requests)
 */
async function readFormData(req: NodeJS.ReadableStream & { headers?: Record<string, string | string[] | undefined> }): Promise<FormData> {
  // For dev server, we use a simple approach
  // In production, you'd use a proper multipart parser
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      // This is a simplified version - in a real implementation,
      // you'd use a multipart parser like busboy or formidable
      const formData = new FormData();
      // For now, just return empty FormData - server actions should
      // use encodeReply which sends as text/plain
      resolve(formData);
    });
    req.on("error", reject);
  });
}

/**
 * Helper to pipe a ReadableStream to response
 */
async function pipeStream(stream: ReadableStream, res: { write: (data: unknown) => void; end: () => void }): Promise<void> {
  const reader = stream.getReader();
  const pump = async (): Promise<void> => {
    const { done, value } = await reader.read();
    if (done) {
      res.end();
      return;
    }
    res.write(value);
    await pump();
  };
  await pump();
}

/**
 * Inject RSC payload into HTML stream using rsc-html-stream
 *
 * This function takes an HTML stream and an RSC stream, and returns
 * a new stream that has the RSC payload injected as script tags.
 *
 * @param htmlStream - The HTML stream from SSR
 * @param rscStream - The RSC Flight stream
 * @param options - Options for injection (e.g., nonce for CSP)
 * @returns A new stream with RSC payload injected
 */
export async function injectRSCPayloadIntoHTML(
  htmlStream: ReadableStream<Uint8Array>,
  rscStream: ReadableStream<Uint8Array>,
  options?: { nonce?: string }
): Promise<ReadableStream<Uint8Array>> {
  // Dynamically import rsc-html-stream to avoid bundling issues
  const { injectRSCPayload } = await import("rsc-html-stream/server");
  return htmlStream.pipeThrough(injectRSCPayload(rscStream, options));
}
