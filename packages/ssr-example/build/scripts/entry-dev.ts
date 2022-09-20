import { webpack } from "webpack";

import { definedWebpackConfig } from "@build/webpack";

import { compilerPromise } from "./compiler";
import { freePort } from "./free-post";
import { logger } from "./log";
import { startDevServer } from "./startDevServer";
import { startServerWatch } from "./startServerWatch";

import type { Compiler } from "webpack";

const withHydrate = async () => {
  await Promise.all([freePort(process.env.DEV_PORT as string), freePort(process.env.WDS_PORT as string)]);
  const multiConfig = definedWebpackConfig({
    serverEntry: process.env.SERVER_ENTRY,
    clientEntry: process.env.CLIENT_ENTRY,
  });
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
  await freePort(process.env.DEV_PORT as string);
  const multiConfig = definedWebpackConfig({
    serverEntry: process.env.SERVER_ENTRY,
    clientEntry: process.env.CLIENT_ENTRY,
  });
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
