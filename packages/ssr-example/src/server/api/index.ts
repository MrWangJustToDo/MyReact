import { apiHandler } from "./lang";

import type { Express } from "express";

export const setApi = (app: Express) => {
  app.use("/api", apiHandler);
};
