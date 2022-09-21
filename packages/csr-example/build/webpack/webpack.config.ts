import { merge } from "webpack-merge";

import { ClientConfig } from "./webpack.client.config";
import { ServerConfig } from "./webpack.server.config";

import type { DefineWebpackConfigProps } from "./type";
import type { Configuration } from "webpack";

export const config = ({
  serverEntry,
  clientEntry,
  webpackClient,
  webpackServer,
  WDS_PORT,
  DEV_HOST,
  DEV_PORT,
  PROD_HOST,
  PROD_PORT,
  ...restProps
}: DefineWebpackConfigProps): Partial<Configuration>[] => {
  const isDEV = process.env.NODE_ENV === "development";

  WDS_PORT = process.env.WDS_PORT || "9001";

  DEV_HOST = process.env.DEV_HOST || "localhost";

  DEV_PORT = process.env.DEV_PORT || "9000";

  PROD_HOST = process.env.PROD_HOST || "5000";

  PROD_PORT = process.env.PROD_PORT || "localhost";

  const externalClientConfig = webpackClient?.({ isDEV, entry: clientEntry });

  const externalServerConfig = webpackServer?.({ isDEV, entry: serverEntry });

  return [
    merge(
      ClientConfig({
        env: "client",
        entry: clientEntry,
        isDEV,
        WDS_PORT,
        DEV_HOST,
        DEV_PORT,
        PROD_HOST,
        PROD_PORT,
        ...restProps,
      }),
      externalClientConfig || {}
    ),
    merge(
      ServerConfig({
        env: "server",
        entry: serverEntry,
        isDEV,
        WDS_PORT,
        DEV_HOST,
        DEV_PORT,
        PROD_HOST,
        PROD_PORT,
        ...restProps,
      }),
      externalServerConfig || {}
    ),
  ];
};
