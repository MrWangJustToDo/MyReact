/**
 * RSC request handler (official plugin-rsc style).
 *
 * Dev: Vite thin middleware converts Connect → Request and calls this.
 * Prod: Node server imports dist/rsc and calls this — no Vite.
 *
 * HTML mode depends on `__RSC_ENABLE_SSR__` (from vite `define` / `RSC_SSR` env):
 * - true: Flight → SSR HTML into #root → inject payload → hydrate
 * - false: empty shell → inject payload → createRoot
 */

import { createElement } from "@my-react/react";
import { handleServerAction, renderToFlightStream } from "@my-react/react-server/server";

import { getHtmlShell } from "./html-shell";
import { jsonResponse, resolveSameOriginPageUrl } from "./request";

import type { renderHTML as RenderHTML } from "./entry.ssr";

const RSC_ENDPOINT = "/__rsc";
const ACTION_ENDPOINT = "/__rsc_action";
const MAX_RSC_BODY_BYTES = 64 * 1024;

export async function renderRsc(url: string) {
  const module = await import("../root");
  const Root = module.default || module;

  const element = createElement(Root, { url });
  return renderToFlightStream(element, {
    onError: (error) => {
      console.error("[@my-react/rsc-example] RSC render error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });
}

async function handleRscEndpoint(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const requestUrl = new URL(request.url);
  let rawPageUrl = requestUrl.searchParams.get("url");

  if (!rawPageUrl && request.method === "POST") {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_RSC_BODY_BYTES) {
      return jsonResponse(413, { error: "Request body too large" });
    }

    let body: string;
    try {
      body = await request.text();
      if (new TextEncoder().encode(body).length > MAX_RSC_BODY_BYTES) {
        return jsonResponse(413, { error: "Request body too large" });
      }
    } catch {
      return jsonResponse(400, { error: "Failed to read body" });
    }

    try {
      const parsed = JSON.parse(body) as { url?: unknown };
      if (typeof parsed.url === "string") {
        rawPageUrl = parsed.url;
      }
    } catch {
      return jsonResponse(400, { error: "Invalid JSON body" });
    }
  }

  const pageUrl = resolveSameOriginPageUrl(rawPageUrl, request.headers.get("host"));
  if (!pageUrl) {
    return jsonResponse(400, {
      error: "Missing or invalid url parameter (same-origin http(s) or absolute path required)",
    });
  }

  const stream = await renderRsc(pageUrl);
  return new Response(stream, {
    headers: {
      "Content-Type": "text/x-component",
      "Cache-Control": "no-cache",
    },
  });
}

async function handleActionEndpoint(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  // Ensure "use server" modules register before handling (A16)
  await import("virtual:my-react-rsc/server-actions-init");
  return handleServerAction(request);
}

async function handleHtml(request: Request): Promise<Response> {
  const { injectRSCPayload } = await import("rsc-html-stream/server");

  const rscStream = await renderRsc(request.url);
  const shell = await getHtmlShell(request.url);

  let htmlWithApp: string;
  let streamForClient: ReadableStream<Uint8Array>;

  if (__RSC_ENABLE_SSR__) {
    const [rscForSsr, rscForBrowser] = rscStream.tee();
    const ssrEntry = await import.meta.viteRsc.loadModule<{ renderHTML: typeof RenderHTML }>("ssr", "index");
    const { html: ssrHtml } = await ssrEntry.renderHTML(rscForSsr);
    htmlWithApp = shell.replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`);
    streamForClient = rscForBrowser;
  } else {
    // No-SSR: keep empty #root; browser createRoot consumes the injected Flight stream
    htmlWithApp = shell;
    streamForClient = rscStream;
  }

  const htmlStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(htmlWithApp));
      controller.close();
    },
  });

  const merged = htmlStream.pipeThrough(injectRSCPayload(streamForClient));

  return new Response(merged, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === RSC_ENDPOINT) {
    return handleRscEndpoint(request);
  }

  if (url.pathname === ACTION_ENDPOINT) {
    return handleActionEndpoint(request);
  }

  if (request.method === "GET") {
    const accept = request.headers.get("accept") || "";
    if (accept.includes("text/html")) {
      return handleHtml(request);
    }
  }

  return jsonResponse(404, { error: "Not found" });
}

// Official convention: default export is the request handler (or { fetch })
export default handler;

if (import.meta.hot) {
  import.meta.hot.accept();
}
