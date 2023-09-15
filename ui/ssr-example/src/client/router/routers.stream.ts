import { createElement, lazy } from "react";

import { noBase } from "@shared";

import { AutoInjectProps } from "../common/AutoInjectProps";
import Layout from "../common/Layout";

import { dynamicRouteConfig } from "./dynamicRoutes";

import type { PreLoadRouteConfig } from "../types/route";

const baseRouter: PreLoadRouteConfig = {
  preLoad: () => Layout,
  element: createElement(AutoInjectProps(Layout)),
};

const dynamicRoutes = dynamicRouteConfig
  .map(({ path, componentPath }) => {
    // just set true for current usage
    if (noBase) {
      return { path, componentPath };
    } else {
      if (path.startsWith("/")) {
        return {
          path: `/${__BASENAME__}/${path.slice(1)}`,
          componentPath,
        };
      } else {
        return {
          path: `/${__BASENAME__}/${path}`,
          componentPath,
        };
      }
    }
  })
  .map((it) => ({
    path: it.path,
    preLoad: () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "page-[request]" */
        `../pages/${it.componentPath}`
      ),
    component: lazy(() =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "page-[request]" */
        `../pages/${it.componentPath}`
      ).then((module) => ({ default: AutoInjectProps(module.default, it.path) }))
    ),
  }))
  .map(({ path, component: Component, preLoad }) => ({
    path: path,
    preLoad,
    element: createElement(Component),
  }));

baseRouter.children = dynamicRoutes;

export const allRoutes = [baseRouter];

typeof window !== "undefined" && ((window as any).__router__ = allRoutes);
