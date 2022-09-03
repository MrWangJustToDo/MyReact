import { allRoutes } from "router/routes";
import { ServerError } from "server/utils/error";
import { preLoad } from "utils/preLoad";

import type { Middleware } from "../compose";

export const loadStore: Middleware = (next) => async (args) => {
  const { req, res, lang, store } = args;

  if (!lang || !store) {
    throw new ServerError(`server 初始化失败 lang: ${lang}, store: ${store}`, 500);
  }

  const { error, redirect, cookies } = (await preLoad(allRoutes, req.path, new URLSearchParams(req.url.split("?")[1]), store)) || {};

  if (cookies) {
    Object.keys(cookies).forEach((key) => {
      res.cookie(key, cookies[key]);
    });
  }

  if (error) {
    throw new ServerError(error, 403);
  }

  if (redirect) {
    const query = redirect.location.query.toString();
    const path = query.length ? redirect.location.pathName + "?" + query : redirect.location.pathName;
    res.writeHead(redirect.code || 302, { location: path });
    res.end();
  } else {
    await next(args);
  }
};
