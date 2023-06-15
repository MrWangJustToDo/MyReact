import loadable from "@loadable/component";
import { createElement } from "react";

import { noBase } from "@shared";

import { AutoInjectProps } from "../common/AutoInjectProps";

import { dynamicRouteConfig } from "./dynamicRoutes";

import type { PreLoadRouteConfig } from "../types/route";

const Layout = loadable(() => import("../common/Layout"), {
  resolveComponent: (module) => AutoInjectProps(module.default),
});

const baseRouter: PreLoadRouteConfig = {
  component: Layout,
  element: createElement(Layout),
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
    component: loadable(() => import(`../pages/${it.componentPath}`), { resolveComponent: (module) => AutoInjectProps(module.default, it.path) }),
  }))
  .map(({ path, component }) => ({
    path: path,
    component,
    element: createElement(component),
  }));

baseRouter.children = dynamicRoutes;

export const allRoutes = [baseRouter];

typeof window !== "undefined" && ((window as any).__router__ = allRoutes);
