import assign from "lodash/assign";

import { Cache } from "./cache";
import { getHeader } from "./headers";
import { log } from "./log";
import { transformPath } from "./path";
import { instance } from "./request";

import type { AxiosResponse } from "axios";
import type { AutoRequestProps, AutoRequestType, CreateRequestType } from "types/utils";

const cacheResult = new Cache<string, Promise<any>>(60000);

const autoParse = (params: string | unknown) => {
  if (typeof params === "string") {
    return JSON.parse(params);
  } else if (params) {
    return params;
  } else {
    return undefined;
  }
};

const autoStringify = (params: string | unknown) => {
  if (typeof params === "string") {
    return params;
  } else if (params) {
    return JSON.stringify(params);
  } else {
    return undefined;
  }
};

const autoAssignParams = (oldParams: string | false | object | undefined, newParams: string | false | object | undefined) => {
  if (newParams === false) {
    return undefined;
  } else {
    return assign(autoParse(oldParams), autoParse(newParams));
  }
};

const createRequest: CreateRequestType = (props: AutoRequestProps = {}) => {
  const { method, path, apiPath, query, data, header, cache = true, encode = false, cacheTime } = props;

  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;

    const newPath = props.path ? props.path : path;

    const newApiPath = props.apiPath ? props.apiPath : apiPath;

    const newQuery = autoAssignParams(query, props.query);

    const newData = autoAssignParams(data, props.data);

    const newHeader = autoAssignParams(header, props.header);

    const newCache = props.cache === false ? false : cache;

    const newEncode = props.encode === false ? false : encode;

    const newCacheTime = props.cacheTime || cacheTime;

    return createRequest({
      method: newMethod,
      path: newPath,
      apiPath: newApiPath,
      query: newQuery,
      data: newData,
      header: newHeader,
      cache: newCache,
      encode: newEncode,
      cacheTime: newCacheTime,
    });
  };

  const cacheKey = transformPath({ path, apiPath, query: autoParse(query) });

  autoRequest.cache = cacheResult;

  autoRequest.cacheKey = cacheKey;

  autoRequest.deleteCache = () => autoRequest.cache.deleteRightNow(autoRequest.cacheKey);

  autoRequest.run = <T>() => {
    const targetRelativePath = autoRequest.cacheKey;

    if (__CLIENT__ && cache) {
      const target = cacheResult.get(targetRelativePath);
      if (target) {
        log(`get data from cache, key: ${targetRelativePath}, path: ${path}, apiName: ${apiPath}`, "normal");
        return target.then((res) => <T>res.data);
      }
    }

    const currentMethod = method || "get";

    const currentHeader = header !== false && __CLIENT__ ? getHeader(autoParse(header)) : autoParse(header);

    const currentData = data !== false ? (encode ? { encode: btoa(autoStringify(data) || "") + window.__ENV__.CRYPTO_KEY } : autoParse(data)) : undefined;

    const requestPromise: Promise<AxiosResponse<T>> = instance({
      method: currentMethod,
      headers: currentHeader,
      url: targetRelativePath,
      data: currentData,
    });

    if (__CLIENT__ && cache) {
      cacheResult.set(targetRelativePath, requestPromise, cacheTime);
      const re = requestPromise.then((res) => res.data);
      re.catch(() => cacheResult.deleteRightNow(targetRelativePath));
      return re;
    } else {
      return requestPromise.then((res) => res.data);
    }
  };

  return autoRequest;
};

if (__CLIENT__ && __DEVELOPMENT__) {
  window.__cache = cacheResult;
  window.__request = createRequest;
}

export { createRequest, autoAssignParams, autoStringify };
