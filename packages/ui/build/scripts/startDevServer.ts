import webpackDevServer from "webpack-dev-server";

import { logger } from "./log";

import type { Compiler, Configuration } from "webpack";

export const startDevServer = (clientCompiler: Compiler, clientConfig: Configuration) => {
  const devServer = new webpackDevServer(clientConfig.devServer, clientCompiler);

  devServer.startCallback(() => logger().info("🚀 Starting the development node server, please wait...."));

  return devServer;
};
