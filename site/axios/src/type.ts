import type { AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";

export type RequestInterceptor = Parameters<AxiosInterceptorManager<AxiosRequestConfig>["use"]>[];

export type ResponseInterceptor = Parameters<AxiosInterceptorManager<AxiosResponse>["use"]>[];

export type BaseCreateOptions = AxiosRequestConfig & {
  requestInterceptors?: RequestInterceptor;
  responseInterceptors?: ResponseInterceptor;
};
