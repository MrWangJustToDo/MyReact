/**
 * Production RSC server — pure Node, no Vite.
 *
 * Serves `dist/client` static assets and delegates everything else to the
 * built RSC entry's `handler(Request)` (same handler used in DEV).
 */

import { createRequire } from "node:module";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * `@my-react/react-dom` CJS entry does `require("react")` and checks `isMyReact`.
 * That resolve is rooted at `packages/myreact-dom`, which finds the monorepo's
 * real `react@18` — Vite aliases and the example's `npm:@my-react/react` dep
 * do not apply there. Remap before loading dist.
 */
function installMyReactAliases() {
  const require = createRequire(import.meta.url);
  const Module = require("module");
  const aliases = {
    react: require.resolve("@my-react/react"),
    "react/jsx-runtime": require.resolve("@my-react/react/jsx-runtime"),
    "react/jsx-dev-runtime": require.resolve("@my-react/react/jsx-dev-runtime"),
    "react-dom": require.resolve("@my-react/react-dom"),
    "react-dom/client": require.resolve("@my-react/react-dom/client"),
    "react-dom/server": require.resolve("@my-react/react-dom/server"),
  };

  const original = Module._resolveFilename;
  Module._resolveFilename = function (request, parent, isMain, options) {
    if (Object.prototype.hasOwnProperty.call(aliases, request)) {
      return aliases[request];
    }
    return original.call(this, request, parent, isMain, options);
  };
}

installMyReactAliases();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const CLIENT_DIR = path.join(__dirname, "dist/client");
const RSC_ENTRY = path.join(__dirname, "dist/rsc/index.js");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function contentType(filePath) {
  return MIME[path.extname(filePath)] || "application/octet-stream";
}

function isSafeClientPath(pathname) {
  const resolved = path.resolve(CLIENT_DIR, "." + pathname);
  return resolved === CLIENT_DIR || resolved.startsWith(CLIENT_DIR + path.sep);
}

async function tryServeStatic(req, res, pathname) {
  if (pathname === "/" || !pathname.includes(".")) {
    return false;
  }

  if (!isSafeClientPath(pathname)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return true;
  }

  const filePath = path.join(CLIENT_DIR, pathname);
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", contentType(filePath));
  if (pathname.startsWith("/assets/")) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  fs.createReadStream(filePath).pipe(res);
  return true;
}

async function readBody(req, maxBytes = 4 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      const err = new Error("Request body too large");
      err.statusCode = 413;
      throw err;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function toFetchRequest(req) {
  const host = req.headers.host || `localhost:${PORT}`;
  const url = new URL(req.url || "/", `http://${host}`).toString();
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      headers.set(key, value.join(", "));
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  const method = req.method || "GET";
  let body;
  if (method !== "GET" && method !== "HEAD") {
    body = await readBody(req);
  }

  return new Request(url, {
    method,
    headers,
    body: body && body.length ? body : undefined,
    duplex: body && body.length ? "half" : undefined,
  });
}

async function pipeWebResponse(response, res) {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(Buffer.from(value));
  }
  res.end();
}

async function start() {
  if (!fs.existsSync(CLIENT_DIR) || !fs.existsSync(RSC_ENTRY)) {
    console.error("Missing build output. Run `pnpm build` first.");
    process.exit(1);
  }

  const mod = await import(pathToFileURL(RSC_ENTRY).href);
  const handler = typeof mod.default === "function" ? mod.default : mod.default?.fetch;

  if (typeof handler !== "function") {
    console.error("dist/rsc/index.js must default-export handler(Request) or { fetch }");
    process.exit(1);
  }

  // Prod HTML shell: built index.html (bootstrap + hashed client entry already injected)
  globalThis.__MY_REACT_RSC_GET_HTML_TEMPLATE__ = async () => {
    return fs.readFileSync(path.join(CLIENT_DIR, "index.html"), "utf-8");
  };

  const server = http.createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname;

      if (await tryServeStatic(req, res, pathname)) {
        return;
      }

      const request = await toFetchRequest(req);
      const response = await handler(request);
      await pipeWebResponse(response, res);
    } catch (error) {
      console.error("[rsc-example] server error:", error);
      const status = error?.statusCode === 413 ? 413 : 500;
      if (!res.headersSent) {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: status === 413 ? "Request body too large" : "Internal Server Error" }));
      } else {
        res.end();
      }
    }
  });

  server.listen(PORT, () => {
    console.log(`[PROD] RSC server (no Vite) at http://localhost:${PORT}`);
  });
}

start();
