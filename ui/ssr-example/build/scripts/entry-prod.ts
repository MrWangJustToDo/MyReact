import { webpack } from "webpack";

import { definedWebpackConfig } from "../webpack";

import { compilerPromise } from "./compiler";
import { DynamicRouter } from "./dynamic";
import { logger } from "./log";

import type { Compiler } from "webpack";

const withCompiler = async () => {
  await new DynamicRouter("universal").getDynamicRouter();
  const multiConfig = definedWebpackConfig({
    serverEntry: process.env.SERVER_ENTRY,
    clientEntry: process.env.CLIENT_ENTRY,
  });
  const multiCompiler = webpack(multiConfig);
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "client") as Compiler;
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "server") as Compiler;
  const clientPromise = compilerPromise("client", clientCompiler, false, false);
  const serverPromise = compilerPromise("server", serverCompiler, false, false);
  serverCompiler.run(() => void 0);
  clientCompiler.run(() => void 0);
  try {
    await Promise.all([clientPromise, serverPromise]);
  } catch (e) {
    logger().error((e as Error)?.message);
  }
};

export const start = async () => await withCompiler();
