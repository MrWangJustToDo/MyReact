import { logger } from "./log";

import type { Compiler } from "webpack";

export const compilerPromise = (name: "client" | "server", compiler: Compiler, development = true) => {
  let count = 0;

  return new Promise<void>((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => logger().info(`[${name}] Compiling`));
    compiler.hooks.done.tap(name, (stats) => {
      if (!stats.hasErrors()) {
        development
          ? logger().info(`[${name}] compiler done, compiler count: ${count++} -- time: ${stats.endTime - stats.startTime} ms`)
          : logger().info(`[${name}] production code compiler done -- time: ${stats.endTime - stats.startTime} ms`);
        if (name === "server") {
          require.cache = {};
        }
        return resolve();
      } else {
        logger().error(`[${name}] Failed to compile`);
        return reject();
      }
    });
  });
};
