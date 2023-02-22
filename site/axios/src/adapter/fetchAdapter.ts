/* eslint-disable @typescript-eslint/no-var-requires */
// SEE https://github.com/vespaiach/axios-fetch-adapter/blob/main/index.js

import { AxiosError } from "axios";

import { FetchTimeOutError } from "./error";
import { generateFetchWithTimeout } from "./fetch";

import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

const buildFullPath = require("axios/lib/core/buildFullPath");
const settle = require("axios/lib/core/settle");
const defaults = require("axios/lib/defaults");
const buildURL = require("axios/lib/helpers/buildURL");
const { isUndefined } = require("axios/lib/utils");

export async function fetchAdapter(config: AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
  let request: Request | null = null;
  try {
    request = createRequest(config);
  } catch (err) {
    if (__DEV__) {
      console.error(`fetch adapter create error, ${(err as Error).message}`);
    }
    return defaults.adapter(config) as AxiosPromise;
  }

  const fetchPromise = getResponse(request, config);

  const data = await fetchPromise;

  return new Promise((resolve, reject) => {
    if (data instanceof Error) {
      reject(data);
    } else {
      settle(resolve, reject, data);
    }
  });
}

/**
 * Fetch API stage two is to get response body. This function tries to retrieve
 * response body based on response's type
 */
async function getResponse(request: Request, config: AxiosRequestConfig): Promise<AxiosResponse | AxiosError> {
  let stageOne: Response;

  const fetch = generateFetchWithTimeout(config.timeout);

  try {
    stageOne = await fetch(request);
  } catch (e) {
    if (e instanceof FetchTimeOutError) {
      return new AxiosError(e.message, AxiosError["ETIMEDOUT"], config, request);
    }
    return new AxiosError((e as Error)?.message, AxiosError["ERR_NETWORK"], config, request);
  }

  const fetchHeaders = new Headers(stageOne.headers);

  const axiosHeaders: Record<string, string> = {};

  fetchHeaders.forEach((v, k) => {
    axiosHeaders[k] = v;
  });

  const response: AxiosResponse = {
    status: stageOne.status,
    statusText: stageOne.statusText,
    headers: axiosHeaders,
    config: config,
    request,
    data: null,
  };

  let data;

  try {
    if (stageOne.status >= 200 && stageOne.status !== 204) {
      switch (config.responseType as AxiosRequestConfig["responseType"]) {
        case "arraybuffer":
          data = await stageOne.arrayBuffer();
          break;
        case "blob":
          data = await stageOne.blob();
          break;
        case "json":
          data = await stageOne.json();
          break;
        default:
          data = await stageOne.text();
          break;
      }
    }
  } catch (e) {
    return new AxiosError((e as Error).message, AxiosError["ERR_BAD_RESPONSE"], config, request, response);
  }

  response.data = data;

  return response;
}

/**
 * This function will create a Request object based on configuration's axios
 */
function createRequest(config: AxiosRequestConfig): Request {
  if (typeof fetch === "undefined") {
    throw new Error("current env not have fetch function");
  }

  const headers = new Headers();

  const { headers: axiosHeaders } = config;

  if (axiosHeaders) {
    Object.keys(axiosHeaders).forEach((key) => {
      headers.set(key, axiosHeaders[key]?.toString() || "");
    });
  }

  // HTTP basic authentication
  if (config.auth) {
    const username = config.auth.username || "";
    const password = config.auth.password ? decodeURI(encodeURIComponent(config.auth.password)) : "";
    headers.set("Authorization", `Basic ${btoa(username + ":" + password)}`);
  }

  const method = config.method?.toUpperCase() || "GET";

  const options: RequestInit = {
    headers: headers,
    method,
  };

  if (method !== "GET" && method !== "HEAD") {
    options.body = config.data;
  }

  const fetchInternalProperties = ["mode", "cache", "integrity", "redirect", "referrer"];

  fetchInternalProperties.forEach((property) => {
    if (Object.prototype.hasOwnProperty.call(config, property)) {
      Object.assign(options, { [property]: property });
    }
  });

  // This config is similar to XHR’s withCredentials flag, but with three available values instead of two.
  // So if withCredentials is not set, default value 'same-origin' will be used
  if (!isUndefined(config.withCredentials)) {
    options.credentials = config.withCredentials ? "include" : "omit";
  }

  const fullPath = buildFullPath(config.baseURL, config.url);
  const url = buildURL(fullPath, config.params, config.paramsSerializer);

  // Expected browser to throw error if there is any wrong configuration value
  return new Request(url, options);
}
