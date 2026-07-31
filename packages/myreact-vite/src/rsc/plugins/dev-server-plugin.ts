/**
 * @file RSC Dev Server Plugin
 * Thin Connect adapter: convert Node req → Request, call RSC entry handler, pipe Response.
 * Routing (HTML / Flight / actions) lives in the app's RSC entry (official plugin-rsc style).
 */

import { withRscSsrOriginalQuery } from "../utils/rsc-original";

import type { Plugin, ViteDevServer } from "vite";

/** Max request body size when converting Connect → Fetch Request (bytes) */
const MAX_REQUEST_BODY_BYTES = 4 * 1024 * 1024;

export interface DevServerPluginOptions {
  rscEndpoint: string;
  actionEndpoint: string;
  /**
   * When false, skip installing the default Connect middleware (e.g. Cloudflare).
   * @default true
   */
  serverHandler?: boolean;
  ssr?: {
    entryRsc: string;
    entrySsr?: string;
    indexHtmlPath?: string;
  };
}

/**
 * Import a module for RSC/SSR work in DEV.
 *
 * Always uses Vite's SSR module graph (`ssrLoadModule`). The `rsc` ModuleRunner
 * evaluates packages according to `environments.rsc.resolve.noExternal`; raw CJS
 * entrypoints such as `@my-react/react` (`module.exports`) throw
 * `module is not defined` when left external.
 */
export async function importFromEnvironment(server: ViteDevServer, _environmentName: string, id: string): Promise<Record<string, unknown>> {
  return server.ssrLoadModule(id);
}

type RscHandler = (request: Request) => Promise<Response> | Response;

function resolveHandler(mod: Record<string, unknown>): RscHandler | null {
  const def = mod.default;
  if (typeof def === "function") {
    return def as RscHandler;
  }
  if (def && typeof def === "object" && typeof (def as { fetch?: unknown }).fetch === "function") {
    return (def as { fetch: RscHandler }).fetch;
  }
  return null;
}

/**
 * Create the RSC dev server plugin
 */
export function createDevServerPlugin(options: DevServerPluginOptions): Plugin {
  const { rscEndpoint, actionEndpoint, ssr, serverHandler = true } = options;

  return {
    name: "vite:my-react-rsc-dev-server",
    enforce: "pre",

    configureServer(server: ViteDevServer) {
      if (!serverHandler || !ssr?.entryRsc) {
        return;
      }

      const templatePath = ssr.indexHtmlPath ?? "index.html";

      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          return next();
        }

        const host = req.headers.host || "localhost";
        const url = new URL(req.url, `http://${host}`);
        const isRsc = url.pathname === rscEndpoint;
        const isAction = url.pathname === actionEndpoint;
        const accept = req.headers.accept || "";
        const wantsHtml = req.method === "GET" && typeof accept === "string" && accept.includes("text/html");

        if (!isRsc && !isAction && !wantsHtml) {
          return next();
        }

        try {
          globalThis.__MY_REACT_RSC_GET_HTML_TEMPLATE__ = async (requestUrl: string) => {
            const html = await readFileText(server, templatePath);
            return server.transformIndexHtml(requestUrl, html);
          };

          globalThis.__MY_REACT_RSC_SSR_LOAD_MODULE__ = (id: string) => server.ssrLoadModule(withRscSsrOriginalQuery(id));

          const entryRsc = await importFromEnvironment(server, "rsc", ssr.entryRsc);
          const handler = resolveHandler(entryRsc);

          if (!handler) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "RSC entry must default-export handler(Request) or { fetch }" }));
            return;
          }

          const request = await createFetchRequest(req, MAX_REQUEST_BODY_BYTES);
          const response = await handler(request);

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
          console.error("[@my-react/react-vite] RSC server handler error:", error);
          const status = (error as { statusCode?: number }).statusCode === 413 ? 413 : 500;
          if (!res.headersSent) {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: status === 413 ? "Request body too large" : "RSC request failed" }));
          } else {
            res.end();
          }
        }
      });
    },
  };
}

/**
 * Resolve a page URL for renderRsc: same-origin absolute URL, or path starting with `/`.
 * Rejects protocol-relative URLs, non-http(s), and cross-origin absolute URLs.
 */
export function resolveSameOriginPageUrl(rawUrl: string | null | undefined, hostHeader: string | string[] | undefined): string | null {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  if (!host) {
    return null;
  }

  const origin = `http://${host}`;

  try {
    if (rawUrl.startsWith("/") && !rawUrl.startsWith("//")) {
      return new URL(rawUrl, origin).toString();
    }

    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (parsed.host !== host) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Helper to read request body as buffer with a hard size limit
 */
async function readBodyBuffer(req: NodeJS.ReadableStream, maxBytes: number): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  let size = 0;
  return new Promise((resolve, reject) => {
    let settled = false;
    req.on("data", (chunk: Uint8Array) => {
      if (settled) return;
      size += chunk.length;
      if (size > maxBytes) {
        settled = true;
        reject(Object.assign(new Error("Request body too large"), { statusCode: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (settled) return;
      settled = true;
      const total = chunks.reduce((sum, buf) => sum + buf.length, 0);
      const merged = new Uint8Array(total);
      let offset = 0;
      for (const buf of chunks) {
        merged.set(buf, offset);
        offset += buf.length;
      }
      resolve(merged);
    });
    req.on("error", (err: unknown) => {
      if (settled) return;
      settled = true;
      reject(err);
    });
  });
}

/**
 * Convert Node request to Fetch Request
 */
async function createFetchRequest(
  req: NodeJS.ReadableStream & { method?: string; url?: string; headers?: Record<string, string | string[] | undefined> },
  maxBodyBytes: number
) {
  const method = req.method ?? "GET";
  const host = req.headers?.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`).toString();
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
    body = await readBodyBuffer(req, maxBodyBytes);
  }

  return new Request(url, {
    method,
    headers,
    body: body ? Buffer.from(body) : undefined,
    // @ts-expect-error Node undici duplex requirement for streaming bodies
    duplex: body ? "half" : undefined,
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
 */
export async function injectRSCPayloadIntoHTML(
  htmlStream: ReadableStream<Uint8Array>,
  rscStream: ReadableStream<Uint8Array>,
  options?: { nonce?: string }
): Promise<ReadableStream<Uint8Array>> {
  const { injectRSCPayload } = await import("rsc-html-stream/server");
  return htmlStream.pipeThrough(injectRSCPayload(rscStream, options));
}

async function readFileText(server: ViteDevServer, filePath: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const { resolve } = await import("node:path");
  const absPath = resolve(server.config.root, filePath);
  return readFile(absPath, "utf-8");
}
