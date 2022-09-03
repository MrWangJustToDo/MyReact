import { apiName } from "config/api";
import { ServerError } from "server/utils/error";
import { getDataSuccess_Server } from "store/reducer/server/share/action";

import type { Middleware } from "../compose";

export const loadCookie: Middleware = (next) => async (args) => {
  const { store, req } = args;

  if (!store) {
    throw new ServerError("store 初始化失败", 500);
  }

  store.dispatch(getDataSuccess_Server({ name: apiName.cookie, data: req.headers.cookie }));

  await next(args);
};
