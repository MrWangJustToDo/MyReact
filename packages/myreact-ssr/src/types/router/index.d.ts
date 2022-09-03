import type React from "react";
import type { RouteObject } from "react-router";
import type { GetInitialStateType } from "types/components";

export interface PreLoadRouteConfig extends RouteObject {
  children?: PreLoadRouteConfig[];
  Component: React.ReactElement | React.ReactComponentElement;
  getInitialState?: GetInitialStateType;
}

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
