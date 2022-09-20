import { RenderError } from "@server/util/renderError";
import { serverLog } from "@server/util/serverLog";

import type { MiddlewareConfig, MiddlewareContext, MiddlewareFunction, RequestHandlerType } from "@server/type";
import type { NextFunction, Request, Response } from "express";

const catchMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { req, res, errorHandler } = ctx;
  try {
    await nextMiddleware();
  } catch (e) {
    serverLog(`url: ${req.originalUrl}, method: ${req.method} error, ${(e as Error).message}`, "error");

    if (errorHandler && typeof errorHandler === "function") {
      if (e instanceof RenderError) {
        await errorHandler({ ctx, req, res, e, code: e.code });
      } else if (e instanceof Error) {
        await errorHandler({ ctx, req, res, e, code: 404 });
      }
    } else {
      res.status(e instanceof RenderError ? e.code : 500).json({ data: (e as Error).toString() });
    }
  }
};

const runRequestMiddlewareHandler: MiddlewareFunction = async (ctx) => {
  const { requestHandler, req, res } = ctx;
  await requestHandler({ req, res });
};

export const compose = (...middleWares: MiddlewareFunction[]) => {
  return function (ctx: MiddlewareContext, next: MiddlewareFunction | RequestHandlerType) {
    let runTime = 0;
    let index = -1;
    // 需要加上死循环判断
    function dispatch(i: number): Promise<void> {
      if (i <= index) {
        // 这些错误将会被 catchMiddlewareHandler  进行捕获
        throw new RenderError("compose index error, every middleware only allow call once", 500);
      }
      // 防止中间件死循环
      runTime++;
      if (runTime > middleWares.length + 5) {
        throw new RenderError("call middleWare many times, look like a infinite loop and will stop call next", 500);
      }
      index = i;
      const fn = middleWares[i] || next;
      if (fn) {
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (e) {
          serverLog(`compose catch error: ${(e as Error).message}`, "error");
          return Promise.resolve();
        }
      } else {
        serverLog("all middleware done, do not call next", "warn");
        return Promise.resolve();
      }
    }
    return dispatch(0);
  };
};

const composedMiddleware = compose(catchMiddlewareHandler, runRequestMiddlewareHandler);

export const defaultRunRequestMiddleware = runRequestMiddlewareHandler;

export const wrapperMiddlewareRequest = function (config: MiddlewareConfig, composed: ReturnType<typeof compose> = composedMiddleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ctx = { ...config, req, res, next };
    try {
      await composed(ctx, ctx.requestHandler);
    } catch (e) {
      res.status(500).json({ data: (e as Error).toString() });
    }
  };
};
