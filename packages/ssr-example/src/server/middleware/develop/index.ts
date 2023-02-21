import { webpackMiddleware } from "./webpackMiddleware";

import type { Express } from "express";

export const develop = async (app: Express) => {
  await webpackMiddleware(app);
};
