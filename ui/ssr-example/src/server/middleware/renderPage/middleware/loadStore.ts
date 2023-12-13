import { allRoutes } from "@client/router";
import { preLoad } from "@client/utils";
import { RenderError } from "@server/util/renderError";
import { clientActionName } from "@shared/store/action";
import { setDataSuccess_client } from "@shared/store/reducer";

import type { Middleware } from "../compose";

export const loadStore: Middleware = (next) => async (args) => {
  const { req, res, lang, store } = args;

  if (!lang || !store) {
    throw new RenderError(`server 初始化失败 lang: ${lang}, store: ${store}`, 500);
  }

  const { error, redirect, page, props } = (await preLoad(allRoutes, req.path, new URLSearchParams(req.url.split("?")[1]), store)) || {};

  args.page = page;

  if (error) {
    throw new RenderError(error, 403);
  }

  if (redirect) {
    const query = redirect.location.query?.toString() || '';

    const path = query.length ? redirect.location.pathName + "?" + query : redirect.location.pathName;

    res.writeHead(redirect.code || 302, { location: path });

    res.end();
  } else {
    props && store.dispatch(setDataSuccess_client({ name: clientActionName.clientProps, data: props }));

    await next(args);
  }
};
