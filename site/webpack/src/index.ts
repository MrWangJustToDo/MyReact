// import * as webpackBundle from "webpack";
import WebpackDevMiddleware from "webpack-dev-middleware";
import WebpackDevServer from "webpack-dev-server";
import WebpackHotMiddleware from "webpack-hot-middleware";
import WebpackNodeExternals from "webpack-node-externals";

import { definedUniversalWebpackConfig } from "./react";
import { safeParse } from "./safeParse";

import type { DefineUniversalWebpackConfigPropsWithReact } from "./react";
import type { Configuration } from "webpack";

const generateErrorMessage = (side: "server" | "client") => {
  return `current config should have a "${side} side code entry", make sure you have define it! you can define it by:
    1. pass to 'definedWebpackConfig({ serverEntry, clientEntry })' function
    2. define in .env file, and import it
    `;
};

export const definedWebpackConfig = ({
  serverEntry,
  clientEntry,
  webpackClient,
  webpackServer,
  isCSR,
  isSSR,
  isDEV,
  isMIDDLEWARE,
  WDS_PORT,
  DEV_PORT,
  DEV_HOST,
  PROD_HOST,
  PROD_PORT,
  BUNDLE_SCOPE,
  OUTPUT_SCOPE,
  ...restProps
}: DefineUniversalWebpackConfigPropsWithReact): Partial<Configuration>[] => {
  serverEntry = serverEntry || safeParse(process.env.SERVER_ENTRY) || "";

  clientEntry = clientEntry || safeParse(process.env.CLIENT_ENTRY) || "";

  if (!serverEntry) throw new Error(generateErrorMessage("server"));

  if (!clientEntry) throw new Error(generateErrorMessage("client"));

  isSSR = Boolean(isSSR || safeParse<boolean>(process.env.SSR || "true"));

  isCSR = isSSR ? false : Boolean(safeParse(process.env.CSR || "false"));

  isDEV = process.env.NODE_ENV === "development";

  isMIDDLEWARE = Boolean(safeParse<boolean>(process.env.MIDDLEWARE || "false"));

  WDS_PORT = process.env.WDS_PORT;

  DEV_HOST = process.env.DEV_HOST;

  DEV_PORT = process.env.DEV_PORT;

  PROD_HOST = process.env.PROD_HOST;

  PROD_PORT = process.env.PROD_PORT;

  if (!WDS_PORT || !DEV_HOST || !DEV_PORT || !PROD_HOST || !PROD_PORT) {
    throw new Error('you should define "WDS_PORT", "DEV_HOST", "DEV_PORT", "PROD_HOST", "PROD_PORT" in .env file');
  }

  OUTPUT_SCOPE = OUTPUT_SCOPE ? (OUTPUT_SCOPE.startsWith("/") ? OUTPUT_SCOPE.slice(1) : OUTPUT_SCOPE) : process.env.OUTPUT_SCOPE || "";

  BUNDLE_SCOPE = BUNDLE_SCOPE ? (BUNDLE_SCOPE.startsWith("/") ? BUNDLE_SCOPE.slice(1) : BUNDLE_SCOPE) : process.env.BUNDLE_SCOPE || "";

  return definedUniversalWebpackConfig({
    serverEntry,
    clientEntry,
    webpackClient,
    webpackServer,
    isCSR,
    isSSR,
    isDEV,
    isMIDDLEWARE,
    WDS_PORT,
    DEV_PORT,
    DEV_HOST,
    PROD_HOST,
    PROD_PORT,
    BUNDLE_SCOPE,
    OUTPUT_SCOPE,
    ...restProps,
  });
};

export { MANIFEST } from "./base";

export { WebpackDevServer, WebpackDevMiddleware, WebpackHotMiddleware, WebpackNodeExternals };
