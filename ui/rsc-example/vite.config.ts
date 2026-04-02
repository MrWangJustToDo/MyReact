import react from "@my-react/react-vite";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";

export default defineConfig({
  ssr: {
    // switch to react need disable all the config below
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/server",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@my-react/react/jsx-runtime",
        "@my-react/react/jsx-dev-runtime",
        "@my-react/react",
        "@my-react/react-dom",
        "@my-react/react-dom/client",
        "@my-react/react-dom/server",
        "@my-react/react-jsx",
        "@my-react/react/jsx-runtime",
        "@my-react/react/jsx-dev-runtime",
        "react-compiler-runtime",
      ],
    },
    noExternal: [
      "react",
      "react-dom",
      "react-dom/server",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@my-react/react",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "@my-react/react-dom",
      "@my-react/react-dom/client",
      "@my-react/react-dom/server",
      "@my-react/react-jsx",
      "@my-react/react/jsx-runtime",
      "@my-react/react/jsx-dev-runtime",
      "react-compiler-runtime",
    ],
  },
  plugins: [
    inspect(),
    react({
      rsc: true,
      rscEndpoint: "/__rsc",
      rscActionEndpoint: "/__rsc_action",
      babel: {
        plugins: [
          [
            "babel-plugin-react-compiler",
            {
              target: "18",
            },
          ],
        ],
      },
    }),
    {
      name: "rsc-example-ssr",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url || req.method !== "GET") {
            return next();
          }

          const url = new URL(req.url, "http://localhost");
          if (url.pathname !== "/") {
            return next();
          }

          try {
            const template = await readFile(path.resolve(server.config.root, "index.html"), "utf-8");
            const html = await server.transformIndexHtml(req.url, template);

            const entryRsc = await server.ssrLoadModule("/src/entry-rsc.tsx");
            const entrySsr = await server.ssrLoadModule("/src/entry-ssr.tsx");
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
          } catch (error: unknown) {
            next(error);
          }
        });
      },
    },
  ],
  server: {
    port: 3000,
  },
});
