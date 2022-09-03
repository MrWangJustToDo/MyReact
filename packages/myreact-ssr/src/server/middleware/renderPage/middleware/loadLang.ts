import { ServerError } from "server/utils/error";
import { preLoadLang } from "utils/preLoad";

import type { Middleware } from "../compose";

export const loadLang: Middleware = (next) => async (args) => {
  const { store, lang } = args;
  if (!store || !lang) {
    throw new ServerError("store or lang 初始化失败", 500);
  }
  await preLoadLang({ store, lang });
  await next(args);
};
