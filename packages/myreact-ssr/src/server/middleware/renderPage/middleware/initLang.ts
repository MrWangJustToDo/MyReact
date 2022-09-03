import { determineUserLang } from "utils/i18n";

import type { Middleware } from "../compose";

export const initLang: Middleware = (next) => async (args) => {
  const { req, res } = args;
  const cookieLang = req.cookies?.site_lang;
  const lang = cookieLang || determineUserLang(req.acceptsLanguages(), req.path);

  res.cookie("site_lang", lang);

  args.lang = lang;
  args.env && (args.env["LANG"] = lang);

  await next(args);
};
