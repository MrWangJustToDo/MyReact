/* eslint-disable prettier/prettier */
/* do not editor this template */
import type { DynamicRouteConfig } from "@client/types/route";

export const dynamicRouteConfig: DynamicRouteConfig[] = [
  { path: "/Antd", componentPath: "Antd" },
  { path: "/Bar", componentPath: "Bar" },
  { path: "/Baz", componentPath: "Baz" },
  { path: "/Foo", componentPath: "Foo" },
  { path: "/Goo", componentPath: "Goo" },
  { path: "/I18n", componentPath: "I18n" },
  { path: "/", componentPath: "index" },
  { path: "/Dynamic/:para", componentPath: "Dynamic/:para" },
  { path: "/*", componentPath: "404" },
];
