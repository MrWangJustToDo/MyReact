import { RenderError } from "@server/util/renderError";
import { loadCurrentLang, supportedLang } from "@shared";

import type { Middleware } from "../compose";

export const loadLang: Middleware = (next) => async (args) => {
  const { store, lang } = args;
  if (!store || !lang) {
    throw new RenderError("store or lang 初始化失败", 500);
  }
  if (!supportedLang[lang as keyof typeof supportedLang]) {
    throw new RenderError("不支持的语言", 404);
  }

  await loadCurrentLang(store.dispatch, lang as keyof typeof supportedLang);

  await next(args);
};
