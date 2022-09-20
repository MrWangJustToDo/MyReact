import type { RenderError } from "./util/renderError";
import type { NextFunction, Request, Response } from "express";

interface ApiResponseData<T> {
  code?: number;
  time?: string;
  state?: string;
  data?: T;
  last?: unknown[];
}
export interface ApiResponseProps<T> {
  res: Response;
  statusCode?: number;
  resDate: ApiResponseData<T>;
}
export interface ApiResponseType<T> {
  (props: ApiResponseProps<T>): void;
}

export interface RequestHandlerProps {
  req: Request;
  res: Response;
}
export interface RequestHandlerType {
  (props: RequestHandlerProps): void;
}

export type ErrorHandlerProps = RequestHandlerProps & {
  code?: number;
  ctx: MiddlewareContext;
  e: Error | RenderError;
};
export interface ErrorHandlerType {
  (props: ErrorHandlerProps): void;
}

export interface MiddlewareConfig {
  errorHandler?: ErrorHandlerType;
  requestHandler: RequestHandlerType;
}

export type MiddlewareContext = MiddlewareConfig & {
  req: Request;
  res: Response;
  next: NextFunction;
};
export interface WrapperMiddleware {
  (): Promise<void> | void;
}
export interface MiddlewareFunction {
  (ctx: MiddlewareContext, next: WrapperMiddleware): void;
}

interface RenderProps {
  req: Request;
  res: Response;
}
export interface RenderType {
  (props: RenderProps): void;
}
export interface RenderErrorType {
  (props: RenderProps & { code?: number; e: Error }): void;
}
