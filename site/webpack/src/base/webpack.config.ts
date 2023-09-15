import { merge } from "webpack-merge";

import { ClientConfig } from "./webpack.client.config";
import { ServerConfig } from "./webpack.server.config";

import type { SafeDefineUniversalWebpackConfigProps, SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const config = <T extends SafeDefineUniversalWebpackConfigProps>({
  serverEntry,
  clientEntry,
  webpackClient,
  webpackServer,
  isDEV,
  isMIDDLEWARE,
  WDS_PORT,
  DEV_HOST,
  DEV_PORT,
  PROD_HOST,
  PROD_PORT,
  BUNDLE_SCOPE,
  OUTPUT_SCOPE,
  // check
  TS_CHECK,
  ESLINT_CHECK,
  BUNDLE_CHECK,
  ...resProps
}: T): Partial<Configuration>[] => {
  const externalClientConfig = webpackClient?.({
    env: "client",
    isDEV,
    isMIDDLEWARE,
    entry: clientEntry,
    WDS_PORT,
    DEV_HOST,
    DEV_PORT,
    PROD_HOST,
    PROD_PORT,
    BUNDLE_SCOPE,
    OUTPUT_SCOPE,
    ...resProps,
  });

  const externalServerConfig = webpackServer?.({
    env: "server",
    isDEV,
    isMIDDLEWARE,
    entry: serverEntry,
    WDS_PORT,
    DEV_HOST,
    DEV_PORT,
    PROD_HOST,
    PROD_PORT,
    BUNDLE_SCOPE,
    OUTPUT_SCOPE,
    ...resProps,
  });

  return [
    merge(
      ClientConfig({
        env: "client",
        isDEV,
        isMIDDLEWARE,
        entry: clientEntry,
        WDS_PORT,
        DEV_HOST,
        DEV_PORT,
        PROD_HOST,
        PROD_PORT,
        BUNDLE_SCOPE,
        OUTPUT_SCOPE,
        TS_CHECK,
        ESLINT_CHECK,
        BUNDLE_CHECK,
      }),
      externalClientConfig || {}
    ),
    merge(
      ServerConfig({
        env: "server",
        entry: serverEntry,
        isDEV,
        isMIDDLEWARE,
        WDS_PORT,
        DEV_HOST,
        DEV_PORT,
        PROD_HOST,
        PROD_PORT,
        BUNDLE_SCOPE,
        OUTPUT_SCOPE,
        TS_CHECK,
        ESLINT_CHECK,
        BUNDLE_CHECK,
      }),
      externalServerConfig || {}
    ),
  ];
};

export const singleConfig = <T extends SafeGenerateActionProps>(props: T & { extendConfig?: (props: T) => Partial<Configuration> }) => {
  return merge(props.env === "client" ? ClientConfig(props) : ServerConfig(props), props.extendConfig?.(props));
};
