import { WebpackDevServer } from "@site/webpack";

import { logger } from "./log";

import type { Compiler, Configuration } from "webpack";

export const startDevServer = (clientCompiler: Compiler, clientConfig: Configuration) => {
  const devServer = new WebpackDevServer(clientConfig.devServer, clientCompiler);

  devServer.startCallback(() => logger().info("🚀 Starting the development node server, please wait...."));

  return devServer;
};
