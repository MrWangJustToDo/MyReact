import http from "node:http";
import { createServer as createViteServer } from "vite";

const PORT = Number(process.env.PORT || 3000);

async function createServer() {
  const vite = await createViteServer({
    root: process.cwd(),
    appType: "custom",
    server: {
      middlewareMode: true,
    },
    mode: "production",
  });

  const server = http.createServer((req, res) => {
    vite.middlewares(req, res, (err) => {
      if (err) {
        res.statusCode = 500;
        res.end(err.stack || String(err));
        return;
      }
      res.statusCode = 404;
      res.end("Not found");
    });
  });

  server.listen(PORT, () => {
    console.log(`RSC example server running at http://localhost:${PORT}`);
  });
}

createServer();
