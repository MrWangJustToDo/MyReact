import { kill } from "cross-port-killer";
import { webpack, type Compiler } from "webpack";

import { compilerPromise } from "./compiler";
import { getConfig } from "./config";
import { logger } from "./log";
import { startDevServer } from "./startDevServer";
import { startServerWatch } from "./startServerWatch";

const withHydrate = async () => {
  await Promise.all([kill(process.env.DEV_PORT as string), kill(process.env.WDS_PORT as string)]);
  const multiConfig = getConfig();
  const multiCompiler = webpack(multiConfig);
  const [clientConfig] = multiConfig;
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "client") as Compiler;
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "server") as Compiler;

  startDevServer(clientCompiler, clientConfig);

  startServerWatch(serverCompiler);

  const clientCompilerPromise = compilerPromise("client", clientCompiler, true);

  const serverCompilerPromise = compilerPromise("server", serverCompiler);

  try {
    await Promise.all([clientCompilerPromise, serverCompilerPromise]);
  } catch (e) {
    logger().error((e as Error)?.message);
  }
};

const withMiddleware = async () => {
  await kill(process.env.DEV_PORT as string);
  const multiConfig = getConfig();
  const [, serverConfig] = multiConfig;
  const serverCompiler = webpack(serverConfig);
  const serverCompilerPromise = compilerPromise("server", serverCompiler);
  serverCompiler.run(() => void 0);
  try {
    await serverCompilerPromise;
  } catch (e) {
    logger().error((e as Error)?.message);
  }
};

export const start = async () => {
  if (process.env.MIDDLEWARE === "true") {
    await withMiddleware();
  } else {
    await withHydrate();
  }
};
