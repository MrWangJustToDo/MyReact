/**
 * Unified RSC Server
 * Uses Vite for both dev and production
 *
 * Dev:  Full HMR, source transformation, RSC flow via plugin
 * Prod: Same RSC flow (source files via ssrLoadModule), serves built client assets
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const isDev = process.env.NODE_ENV !== "production";

async function startServer() {
  if (!isDev && !fs.existsSync(path.join(__dirname, "dist/client"))) {
    console.error("Run `pnpm build` first.");
    process.exit(1);
  }

  const vite = await createServer({
    root: __dirname,
    appType: "custom",
    server: {
      port: PORT,
      hmr: isDev,
    },
  });

  // Production: serve built client assets
  if (!isDev) {
    const CLIENT_DIR = path.join(__dirname, "dist/client");

    // Read built HTML (has correct asset paths)
    const builtHtml = fs.readFileSync(path.join(CLIENT_DIR, "index.html"), "utf-8");

    // Serve built assets before other middleware
    vite.middlewares.use((req, res, next) => {
      const pathname = new URL(req.url || "/", "http://localhost").pathname;

      // Serve built client assets
      if (pathname.startsWith("/assets/")) {
        const file = path.join(CLIENT_DIR, pathname);
        if (fs.existsSync(file)) {
          const MIME = {
            ".js": "application/javascript",
            ".css": "text/css",
            ".json": "application/json",
          };
          res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          fs.createReadStream(file).pipe(res);
          return;
        }
      }
      next();
    });

    // Override transformIndexHtml to return built HTML
    const origTransform = vite.transformIndexHtml.bind(vite);
    vite.transformIndexHtml = async () => builtHtml;
  }

  await vite.listen();
  console.log(`[${isDev ? "DEV" : "PROD"}] RSC server at http://localhost:${PORT}`);
}

startServer();
