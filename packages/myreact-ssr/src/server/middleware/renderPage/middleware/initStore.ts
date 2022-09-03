import { createUniversalStore } from "store";

import type { Middleware } from "../compose";

export const initStore: Middleware = (next) => async (args) => {
  const store = createUniversalStore();
  args.store = store;
  await next(args);
};
