import loadable from "@loadable/component";
import { createElement } from "react";

import { getIsStaticGenerate } from "@shared";

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
    if (getIsStaticGenerate()) {
      if (path.startsWith("/")) {
        return {
          path: `/MyReact/${path.slice(1)}`,
          componentPath,
        };
      } else {
        return {
          path: `/MyReact/${path}`,
          componentPath,
        };
      }
    } else {
      return { path, componentPath };
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
