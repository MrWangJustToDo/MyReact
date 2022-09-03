const { Compiler } = require("webpack");

/**
 *
 * @param {Compiler} serverCompiler
 * @returns {Compiler}
 */
const startServerWatch = (serverCompiler) => {
  serverCompiler.watch(
    {
      aggregateTimeout: 800, // 聚合多个修改一起构建
      ignored: ["**/node_modules/**", "**/router/dynamicRoutes.ts", "**/dev/**", "**/dist/**"], // 排除文件
    },
    (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    }
  );

  return serverCompiler;
};

exports.startServerWatch = startServerWatch;
