import chalk from "chalk";
import assign from "lodash/assign";

import { ServerError } from "server/utils/error";
import { Cache } from "utils/cache";
import { log } from "utils/log";

import type { NextFunction, Request, Response } from "express";
import type {
  ApiResponseProps,
  CacheConfigProps,
  ExpressRequest,
  MiddlewareConfig,
  MiddlewareContext,
  MiddlewareFunction,
  RequestHandlerType,
} from "types/server";

const cache = new Cache<string, unknown>();

let currentResponseDate: null | unknown = null;

export const success = <T>({ res, statusCode = 200, resDate }: ApiResponseProps<T>): void => {
  // 缓存当前成功的请求数据
  if (resDate.data || resDate.last) {
    currentResponseDate = resDate;
  } else {
    currentResponseDate = null;
  }
  resDate.code = resDate.code || 0;
  resDate.state = resDate.state || "获取成功";
  resDate.time = new Date().toLocaleString();
  res.status(statusCode).json(resDate);
};

export const fail = <T>({ res, statusCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (__DEVELOPMENT__ && methodName) {
    resDate["methodName"] = `method: ${methodName} 出现错误`;
  } else {
    delete resDate["methodName"];
  }
  resDate.code = resDate.code || -1;
  resDate.state = resDate.state || "获取失败";
  resDate.time = new Date().toLocaleString();
  res.status(statusCode).json(resDate);
};

export const catchMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { req, res, errorHandler } = ctx;
  try {
    await nextMiddleware();
  } catch (e) {
    ctx.hasError = true;
    log(new Error(`url: ${req.originalUrl}, method: ${req.method} error, ${(e as Error).message}`), "error");

    if (errorHandler && typeof errorHandler === "function") {
      if (e instanceof ServerError) {
        await errorHandler({ ctx, req, res, e, code: e.code, cache });
      } else if (e instanceof Error) {
        await errorHandler({ ctx, req, res, e, code: 404, cache });
      }
    } else {
      const url = req.originalUrl;
      const method = req.method;
      const methodName = ctx.requestHandler.name;
      fail({
        res,
        statusCode: e instanceof ServerError ? e.code : undefined,
        resDate: { state: `url: ${url}, method: ${method} 访问失败`, data: (e as Error).message },
        methodName,
      });
    }
  }
};

const processNeedDelete = ({ needDelete, req, key }: { needDelete?: CacheConfigProps["needDelete"]; req: ExpressRequest; key: string }) => {
  if (needDelete) {
    if (Array.isArray(needDelete)) {
      needDelete.forEach((item: string | (({ req }: { req: ExpressRequest }) => string | string[])) => {
        if (typeof item === "function") {
          const key = item({ req });
          if (Array.isArray(key)) {
            key.forEach((i) => cache.deleteRightNow(i));
          } else {
            cache.deleteRightNow(key);
          }
        } else {
          cache.deleteRightNow(item);
        }
      });
    } else if (typeof needDelete === "string") {
      cache.deleteRightNow(needDelete);
    } else if (needDelete === true) {
      cache.deleteRightNow(key);
    } else {
      const key = needDelete({ req });
      if (Array.isArray(key)) {
        key.forEach((i) => cache.deleteRightNow(i));
      } else {
        cache.deleteRightNow(key);
      }
    }
  }
};

const cacheMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { cacheConfig, cache, req, res } = ctx;
  const currentCacheConfig = assign({}, cacheConfig, req.config?.cache);
  const key = currentCacheConfig.cacheKey
    ? typeof currentCacheConfig.cacheKey === "function"
      ? currentCacheConfig.cacheKey({ req })
      : currentCacheConfig.cacheKey
    : req.originalUrl;

  const needCache = currentCacheConfig.needCache;
  const cacheTime = currentCacheConfig.cacheTime;
  const needDelete = currentCacheConfig.needDelete;
  const needDeleteAfterRequest = currentCacheConfig.needDeleteAfterRequest;
  const needDeleteBeforeRequest = currentCacheConfig.needDeleteBeforeRequest;
  processNeedDelete({ needDelete, key, req });
  processNeedDelete({ needDelete: needDeleteBeforeRequest, key, req });
  if (needCache) {
    const cacheValue = cache.get(key);
    if (cacheValue) {
      log(`get response data from cache. method: ${req.method}, url: ${req.originalUrl}, key: ${key}`, "normal");
      success({ res, resDate: cacheValue });
    } else {
      await nextMiddleware();
      if (currentResponseDate) {
        cache.set(key, currentResponseDate, cacheTime);
      } else {
        log(`nothing to get, so nothing to cache. method: ${req.method}, url: ${req.originalUrl}`, "warn");
      }
    }
  } else {
    await nextMiddleware();
  }
  if (needDeleteAfterRequest) {
    if (Array.isArray(needDeleteAfterRequest)) {
      needDeleteAfterRequest.forEach((item: string | (({ req }: { req: ExpressRequest }) => string | string[])) => {
        if (typeof item === "function") {
          const key = item({ req });
          if (Array.isArray(key)) {
            key.forEach((i) => cache.deleteRightNow(i));
          } else {
            cache.deleteRightNow(key);
          }
        } else {
          cache.deleteRightNow(item);
        }
      });
    } else if (typeof needDeleteAfterRequest === "string") {
      cache.deleteRightNow(needDeleteAfterRequest);
    } else if (needDeleteAfterRequest === true) {
      cache.deleteRightNow(key);
    } else {
      const key = needDeleteAfterRequest({ req, cacheData: currentResponseDate });
      if (Array.isArray(key)) {
        key.forEach((i) => cache.deleteRightNow(i));
      } else {
        cache.deleteRightNow(key);
      }
    }
  }
  currentResponseDate = null;
};

const checkCodeMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { req, checkCodeConfig } = ctx;
  const currentCheckCodeConfig = assign({}, checkCodeConfig, req.config?.check);
  const needCheck = currentCheckCodeConfig.needCheck;
  const fieldName = currentCheckCodeConfig.fieldName || "checkCode";
  const fromQuery = currentCheckCodeConfig.fromQuery;
  if (needCheck) {
    if (fromQuery) {
      const checkCode = req.query[fieldName];
      if (!checkCode) {
        throw new ServerError(`请求参数不存在: ${fieldName}`, 400);
      }
      if (checkCode !== req.session.captcha) {
        throw new ServerError("验证码不正确 from query", 400);
      }
    } else {
      const checkCode = req.body[fieldName];
      if (!checkCode) {
        throw new ServerError(`请求参数不存在: ${fieldName}`, 400);
      }
      if (checkCode !== req.session.captcha) {
        throw new ServerError("验证码不正确 from body", 400);
      }
    }
  }
  await nextMiddleware();
};

const checkParamsMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { paramsConfig, req } = ctx;
  const currentCheckParamsConfig = assign({}, paramsConfig, req.config?.params);
  const currentFromQuery = currentCheckParamsConfig.fromQuery;
  const currentFromBody = currentCheckParamsConfig.fromBody;
  if (currentFromBody && currentFromBody.length > 0) {
    for (let i = 0; i < currentFromBody.length; i++) {
      if (req.body[currentFromBody[i]] === undefined) {
        throw new ServerError(`请求参数错误, body: ${currentFromBody[i]}`, 403);
      }
    }
  }
  if (currentFromQuery && currentFromQuery.length > 0) {
    for (let i = 0; i < currentFromQuery.length; i++) {
      if (req.query[currentFromQuery[i]] === undefined) {
        throw new ServerError(`请求参数错误, query: ${currentFromQuery[i]}`, 403);
      }
    }
  }
  await nextMiddleware();
};

const decodeMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const { req, encodeConfig } = ctx;
  const currentEncodeConfig = encodeConfig || req.config?.encode;
  if (currentEncodeConfig) {
    if (typeof req.body.encode === "undefined") {
      throw new ServerError("当前请求体格式不正确", 400);
    } else {
      let encodeBodyString = req.body["encode"].toString() as string;
      if (process.env) {
        if (encodeBodyString.endsWith(process.env.CRYPTO_KEY)) {
          encodeBodyString = encodeBodyString.slice(0, -process.env.CRYPTO_KEY.length);
        }
      }
      const bodyString = Buffer.from(encodeBodyString, "base64").toString();
      req.body = JSON.parse(bodyString);
    }
  }
  await nextMiddleware();
};

const logMiddlewareHandler: MiddlewareFunction = async (ctx, nextMiddleware) => {
  const url = ctx.req.originalUrl;
  const method = ctx.requestHandler.name;
  const key = chalk.redBright("[time log] method: " + method + ", url: " + url + ", time");
  console.time(key);
  await nextMiddleware();
  console.timeEnd(key);
};

// 默认请求的中间件函数，不执行下一个
const runRequestMiddlewareHandler: MiddlewareFunction = async (ctx) => {
  const { requestHandler, req, res, cache } = ctx;
  await requestHandler({ req, res, cache });
};

export const compose = (...middleWares: MiddlewareFunction[]) => {
  return function (ctx: MiddlewareContext, next: MiddlewareFunction | RequestHandlerType) {
    let runTime = 0;
    let index = -1;
    // 需要加上死循环判断
    function dispatch(i: number): Promise<void> {
      if (i <= index) {
        // 这些错误将会被 catchMiddlewareHandler  进行捕获
        throw new ServerError("compose index error, every middleware only allow call once", 500);
      }
      // 防止中间件死循环
      runTime++;
      if (runTime > middleWares.length + 5) {
        throw new ServerError("call middleWare many times, look like a infinite loop and will stop call next", 500);
      }
      index = i;
      const fn = middleWares[i] || next;
      if (fn) {
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (e) {
          ctx.hasError = true;
          log(`compose catch error: ${(e as Error).message}`, "error");
          return Promise.resolve();
        }
      } else {
        log("all middleware done, do not call next", "warn");
        return Promise.resolve();
      }
    }
    return dispatch(0);
  };
};

const composedMiddleware = compose(
  logMiddlewareHandler,
  catchMiddlewareHandler,
  decodeMiddlewareHandler,
  checkParamsMiddlewareHandler,
  checkCodeMiddlewareHandler,
  cacheMiddlewareHandler,
  runRequestMiddlewareHandler
);

export const defaultRunRequestMiddleware = runRequestMiddlewareHandler;

export const wrapperMiddlewareRequest = function (config: MiddlewareConfig, composed: ReturnType<typeof compose> = composedMiddleware, goNext?: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 每一个新的请求  需要清除原始的缓存数据
    currentResponseDate = null;
    const ctx = { ...config, req, res, next, cache };
    try {
      await composed(ctx, ctx.requestHandler);
    } catch (e) {
      fail({ res, statusCode: 500, resDate: { data: (e as Error).toString(), methodName: "composed" } });
    }
    if ((ctx.goNext || goNext) && !ctx.hasError) {
      next();
    }
  };
};
