/**
 * @file RSC Dev Server Plugin
 * Development server endpoints for RSC streaming and server actions
 * Uses rsc-html-stream for injecting RSC payload into HTML
 */

import { createElement } from "@my-react/react/type";
import { renderToFlightStream } from "@my-react/react-server/server";

import type { Plugin, ViteDevServer } from "vite";

export interface DevServerPluginOptions {
  rscEndpoint: string;
  actionEndpoint: string;
  ssr?: {
    entryRsc: string;
    entrySsr: string;
    indexHtmlPath?: string;
  };
}

/**
 * Create the RSC dev server plugin
 */
export function createDevServerPlugin(options: DevServerPluginOptions): Plugin {
  const { rscEndpoint, actionEndpoint, ssr } = options;

  return {
    name: "vite:my-react-rsc-dev-server",
    enforce: "pre",

    configureServer(server: ViteDevServer) {
      if (ssr) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url || req.method !== "GET") {
            return next();
          }

          const url = new URL(req.url, `http://${req.headers.host}`);
          if (url.pathname === rscEndpoint || url.pathname === actionEndpoint) {
            return next();
          }

          const accept = req.headers["accept"] || "";
          if (typeof accept === "string" && !accept.includes("text/html")) {
            return next();
          }

          try {
            const templatePath = ssr.indexHtmlPath ?? "index.html";
            const html = await server.transformIndexHtml(req.url, await readFileText(server, templatePath));

            const entryRsc = await server.ssrLoadModule(ssr.entryRsc);
            const entrySsr = await server.ssrLoadModule(ssr.entrySsr);
            const { injectRSCPayload } = await import("rsc-html-stream/server");

            const origin = `http://${req.headers.host || "localhost:3000"}`;
            const fullUrl = new URL(req.url, origin).toString();

            const rscStream = await entryRsc.renderRsc(fullUrl);
            const [rscForSsr, rscForClient] = rscStream.tee();

            const { html: ssrHtml } = await entrySsr.renderHTML(rscForSsr, {
              loadModule: (id: string) => server.ssrLoadModule(id),
            });

            const htmlWithApp = html.replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`);

            const htmlStream = new ReadableStream<Uint8Array>({
              start(controller) {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(htmlWithApp));
                controller.close();
              },
            });

            const mergedStream = htmlStream.pipeThrough(injectRSCPayload(rscForClient));

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");

            const reader = mergedStream.getReader();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(Buffer.from(value));
            }
            res.end();
            return;
          } catch (error) {
            return next(error as Error);
          }
        });
      }

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

          // Get props from request body or query
          let props = {};
          if (req.method === "POST") {
            const body = await readBodyText(req);
            props = JSON.parse(body);
          }

          const element = createElement(Component, props);
          const stream = await renderToFlightStream(element, {
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
          const request = await createFetchRequest(req);
          const serverModule = await server.ssrLoadModule("@my-react/react-server/server");
          const response: Response = await serverModule.handleServerAction(request);

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });

          if (response.body) {
            await pipeStream(response.body, res);
          } else {
            res.end();
          }
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
function readBodyText(req: { on: (event: string, cb: (data?: unknown) => void) => void }): Promise<string> {
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
 * Helper to read request body as buffer
 */
async function readBodyBuffer(req: NodeJS.ReadableStream): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk: Uint8Array) => {
      chunks.push(chunk);
    });
    req.on("end", () => {
      const total = chunks.reduce((sum, buf) => sum + buf.length, 0);
      const merged = new Uint8Array(total);
      let offset = 0;
      for (const buf of chunks) {
        merged.set(buf, offset);
        offset += buf.length;
      }
      resolve(merged);
    });
    req.on("error", reject);
  });
}

/**
 * Convert Node request to Fetch Request
 */
async function createFetchRequest(req: NodeJS.ReadableStream & { method?: string; url?: string; headers?: Record<string, string | string[] | undefined> }) {
  const method = req.method ?? "GET";
  const url = new URL(req.url || "/", `http://${req.headers?.host || "localhost"}`).toString();
  const headers = new Headers();

  if (req.headers) {
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        headers.set(key, value.join(", "));
      } else if (value !== undefined) {
        headers.set(key, value);
      }
    }
  }

  let body: Uint8Array | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await readBodyBuffer(req);
  }

  return new Request(url, {
    method,
    headers,
    body: body ? Buffer.from(body) : undefined,
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

async function readFileText(server: ViteDevServer, filePath: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const { resolve } = await import("node:path");
  const absPath = resolve(server.config.root, filePath);
  return readFile(absPath, "utf-8");
}
