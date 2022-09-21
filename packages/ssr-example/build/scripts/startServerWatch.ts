import { logger } from "./log";

import type { Compiler } from "webpack";

export const startServerWatch = (serverCompiler: Compiler) => {
  serverCompiler.watch(
    {
      aggregateTimeout: 1000,
      ignored: ["**/node_modules/**", "**/router/dynamicRoutes.ts", "**/dist/**", "**/dev/**"],
    },
    (err, stats) => {
      if (err) {
        logger().error(err.stack || err.message);
      }

      if (stats?.hasErrors()) {
        logger().error(stats.toJson().errors);
      }

      if (stats?.hasWarnings()) {
        logger().warn(stats.toJson().warnings);
      }
    }
  );
};
