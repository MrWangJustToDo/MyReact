import axios from "axios";

import { fetchAdapter } from "./adapter";
import { serverLog } from "./Interceptor";

import type { BaseCreateOptions, RequestInterceptor, ResponseInterceptor } from "./type";

const BASE_TIME_OUT = 3000;

const BASE_REQUEST_INTERCEPTORS: RequestInterceptor = [];

const BASE_RESPONSE_INTERCEPTORS: ResponseInterceptor = [[undefined, serverLog]];

function createRequest({
  method = "get",
  timeout = BASE_TIME_OUT,
  requestInterceptors = [],
  responseInterceptors = [],
  ...axiosConfig
}: BaseCreateOptions = {}) {
  const axiosInstance = axios.create({
    method,
    timeout,
    adapter: fetchAdapter,
    ...axiosConfig,
  });

  const finalRequestInterceptors = BASE_REQUEST_INTERCEPTORS.concat(requestInterceptors);

  const finalResponseInterceptors = BASE_RESPONSE_INTERCEPTORS.concat(responseInterceptors);

  finalRequestInterceptors.forEach((interceptor) => axiosInstance.interceptors.request.use(...interceptor));

  finalResponseInterceptors.forEach((interceptor) => axiosInstance.interceptors.response.use(...interceptor));

  return axiosInstance;
}

export { createRequest };
