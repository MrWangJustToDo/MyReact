import type { GetInitialStateType, PreLoadComponentType } from "./common";
import type { LoadableComponent } from "@loadable/component";
import type { RouteObject } from "react-router";

export type PreLoadRouteConfig = RouteObject & {
  children?: PreLoadRouteConfig[];
  preLoad?: () => PreLoadComponentType | Promise<PreLoadComponentType | { default: PreLoadComponentType }>;
  component?: LoadableComponent<Record<string, unknown>> | PreLoadComponentType;
  getInitialState?: GetInitialStateType;
};

export interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}

export interface DynamicRouteConfig {
  path: string;
  componentPath?: string;
}
