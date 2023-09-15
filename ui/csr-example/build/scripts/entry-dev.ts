import { kill } from "cross-port-killer";
import { webpack } from "webpack";

import { compilerPromise } from "./compiler";
import { getConfig } from "./config";
import { logger } from "./log";
import { startDevServer } from "./startDevServer";
import { startServerWatch } from "./startServerWatch";

import type { Compiler } from "webpack";

const withHydrate = async () => {
  await Promise.all([kill(process.env.DEV_PORT as string), kill(process.env.WDS_PORT as string)]);
  const multiConfig = getConfig();

  const multiCompiler = webpack(multiConfig);
  const [clientConfig] = multiConfig;
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "client") as Compiler;
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "server") as Compiler;

  startDevServer(clientCompiler, clientConfig);

  startServerWatch(serverCompiler);

  const clientCompilerPromise = compilerPromise("client", clientCompiler);

  const serverCompilerPromise = compilerPromise("server", serverCompiler);

  try {
    await Promise.all([clientCompilerPromise, serverCompilerPromise]);
  } catch (e) {
    logger().error((e as Error)?.message);
  }
};

export const start = withHydrate;
