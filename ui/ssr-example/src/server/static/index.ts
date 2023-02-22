import fs from "fs";

import { getStaticPageManifest } from "./util";

import type { Express } from "express";

export const page = (app: Express) => {
  if (!__DEVELOPMENT__) {
    app.use(async (req, res, next) => {
      // should refresh and cache when some usage
      const staticPageManifest = await getStaticPageManifest().catch(() => null);
      const fileName = staticPageManifest?.[`.${req.path}`];
      if (fileName) {
        const stream = fs.createReadStream(fileName);
        res.setHeader("content-type", "text/html");
        stream.pipe(res);
      } else {
        next();
      }
    });
  }
};
