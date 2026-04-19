/**
 * Unified RSC Server
 * Handles both development and production modes
 *
 * Dev mode:  Uses Vite dev server with HMR
 * Prod mode: Serves from dist/ with manifests
 *
 * Usage:
 *   NODE_ENV=development node server.mjs  # Dev mode
 *   NODE_ENV=production node server.mjs   # Prod mode (requires build first)
 */

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3002);
const isDev = process.env.NODE_ENV !== "production";

// Check if dist exists for production mode
const distExists = fs.existsSync(path.join(__dirname, "dist/client"));

if (!isDev && !distExists) {
  console.error("Production mode requires built assets. Run `pnpm build` first.");
  process.exit(1);
}

async function createDevServer() {
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({
    root: __dirname,
    appType: "custom",
    server: {
      middlewareMode: true,
      port: PORT,
    },
  });

  const server = http.createServer((req, res) => {
    vite.middlewares(req, res, (err) => {
      if (err) {
        console.error("Dev server error:", err);
        res.statusCode = 500;
        res.end(err.stack || String(err));
        return;
      }
      res.statusCode = 404;
      res.end("Not found");
    });
  });

  server.listen(PORT, () => {
    console.log(`[DEV] RSC server running at http://localhost:${PORT}`);
  });

  return server;
}

async function createProdServer() {
  // Set up module aliasing for @my-react packages
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const Module = require("module");

  const originalResolveFilename = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, isMain, options) {
    if (request === "react" || request.startsWith("react/")) {
      request = request.replace(/^react/, "@my-react/react");
    }
    if (request === "react-dom" || request.startsWith("react-dom/")) {
      request = request.replace(/^react-dom/, "@my-react/react-dom");
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
  };

  // Paths
  const CLIENT_DIR = path.join(__dirname, "dist/client");
  const SSR_DIR = path.join(__dirname, "dist/ssr");
  const RSC_DIR = path.join(__dirname, "dist/rsc");

  // MIME types
  const MIME_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  // Load HTML template (built by vite with RSC config)
  const indexHtmlPath = path.join(CLIENT_DIR, "index.html");
  if (!fs.existsSync(indexHtmlPath)) {
    console.error("Missing dist/client/index.html. Run `pnpm build` first.");
    process.exit(1);
  }
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf-8");

  // Load manifests
  const clientManifestPath = path.join(CLIENT_DIR, "client-manifest.json");
  const clientManifest = fs.existsSync(clientManifestPath) ? JSON.parse(fs.readFileSync(clientManifestPath, "utf-8")) : {};

  // Load SSR client manifest - maps module IDs to SSR chunks with actual component code
  const ssrClientManifestPath = path.join(SSR_DIR, "ssr-client-manifest.json");
  const ssrClientManifest = fs.existsSync(ssrClientManifestPath) ? JSON.parse(fs.readFileSync(ssrClientManifestPath, "utf-8")) : {};

  // Import SSR entry first - this sets up the React renderer
  const rscEntry = await import(path.join(RSC_DIR, "index.js"));
  const ssrEntry = await import(path.join(SSR_DIR, "index.js"));

  // Preload SSR client modules (actual component code for SSR)
  const ssrModuleCache = new Map();
  for (const [key, entry] of Object.entries(ssrClientManifest)) {
    const modulePath = path.join(SSR_DIR, entry.ssrModule);
    if (!ssrModuleCache.has(entry.id)) {
      try {
        const mod = await import(modulePath);
        ssrModuleCache.set(entry.id, mod);
      } catch (e) {
        console.warn(`Failed to preload SSR module ${entry.id}:`, e.message);
      }
    }
  }
  console.log(`Preloaded ${ssrModuleCache.size} SSR client modules`);

  // Load server action modules
  const rscFiles = fs.readdirSync(RSC_DIR);
  const actionModules = rscFiles.filter((f) => f.startsWith("__server_action_") && f.endsWith(".js"));
  for (const actionFile of actionModules) {
    await import(path.join(RSC_DIR, actionFile));
  }
  if (actionModules.length > 0) {
    console.log(`Loaded ${actionModules.length} server action modules`);
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);
    const pathname = url.pathname;

    try {
      // RSC endpoint
      if (pathname === "/__rsc") {
        let props = {};
        if (req.method === "POST") {
          const body = await readBody(req);
          props = JSON.parse(body);
        }

        const fullUrl = props.url || url.toString();
        const rscStream = await rscEntry.renderRsc(fullUrl);

        res.setHeader("Content-Type", "text/x-component");
        res.setHeader("Cache-Control", "no-cache");

        const reader = rscStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
        return;
      }

      // Server action endpoint
      if (pathname === "/__rsc_action" && req.method === "POST") {
        const serverModule = await import("@my-react/react-server/server");
        const request = await createFetchRequest(req, url);
        const response = await serverModule.handleServerAction(request);

        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
          res.setHeader(key, value);
        });

        if (response.body) {
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        }
        res.end();
        return;
      }

      // Static files
      if (pathname.startsWith("/assets/") || pathname.endsWith(".js") || pathname.endsWith(".css")) {
        const filePath = path.join(CLIENT_DIR, pathname);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(filePath);
          res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }

      // HTML pages - RSC + SSR
      if (req.headers.accept?.includes("text/html")) {
        const fullUrl = `http://localhost:${PORT}${req.url}`;
        const rscStream = await rscEntry.renderRsc(fullUrl);
        const [rscForSsr, rscForClient] = rscStream.tee();

        // SSR render - load actual client component code from SSR bundles
        const { html: ssrHtml } = await ssrEntry.renderHTML(rscForSsr, {
          loadModule: async (id) => {
            const cleanId = id.split("?")[0];

            // Use preloaded SSR module (actual component code)
            if (ssrModuleCache.has(cleanId)) {
              return ssrModuleCache.get(cleanId);
            }

            // Try to load from SSR manifest
            for (const [key, entry] of Object.entries(ssrClientManifest)) {
              if (key.startsWith(cleanId + "#") || entry.id === cleanId) {
                const modulePath = path.join(SSR_DIR, entry.ssrModule);
                try {
                  const mod = await import(modulePath);
                  ssrModuleCache.set(cleanId, mod);
                  return mod;
                } catch (e) {
                  console.warn(`[SSR] Failed to load module ${cleanId}:`, e.message);
                }
              }
            }

            console.warn(`[SSR] Could not find module: ${id}`);
            return {};
          },
        });

        // Inject RSC payload
        const { injectRSCPayload } = await import("rsc-html-stream/server");

        let finalHtml = indexHtml;
        finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${ssrHtml}</div>`);

        const encoder = new TextEncoder();
        const htmlStream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(finalHtml));
            controller.close();
          },
        });

        const mergedStream = htmlStream.pipeThrough(injectRSCPayload(rscForClient));

        res.setHeader("Content-Type", "text/html");
        const reader = mergedStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
        return;
      }

      // 404
      res.statusCode = 404;
      res.end("Not found");
    } catch (error) {
      console.error("Server error:", error);
      res.statusCode = 500;
      res.end(error instanceof Error ? error.message : "Internal server error");
    }
  });

  server.listen(PORT, () => {
    console.log(`[PROD] RSC server running at http://localhost:${PORT}`);
  });

  return server;
}

// Helper functions
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function createFetchRequest(req, url) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    } else if (value) {
      headers.set(key, value);
    }
  }

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }

  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });
}

// Start server
if (isDev) {
  createDevServer();
} else {
  createProdServer();
}
