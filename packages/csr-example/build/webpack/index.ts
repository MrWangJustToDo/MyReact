import { safeParse } from "./utils";
import { config } from "./webpack.config";

import type { DefineWebpackConfigProps } from "./type";
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
  ...restProps
}: DefineWebpackConfigProps): Partial<Configuration>[] => {
  serverEntry = serverEntry || safeParse(process.env.SERVER_ENTRY) || "";

  clientEntry = clientEntry || safeParse(process.env.CLIENT_ENTRY) || "";

  if (!serverEntry) throw new Error(generateErrorMessage("server"));

  if (!clientEntry) throw new Error(generateErrorMessage("client"));

  return config({ serverEntry, clientEntry, webpackClient, webpackServer, ...restProps });
};
