const { merge } = require("webpack-merge");
const { rulesConfig } = require("./rules");
const { outputConfig } = require("./output");
const { pluginsConfig } = require("./plugins");
const { externalsConfig } = require("./externals");
const { BaseConfig } = require("./webpack.base.config");

/**
 *
 * @param {{entryPath: string, isDev: boolean, isSSR: boolean, isMiddleWareDevelop: boolean, isAnimationRouter: boolean, isCSR: boolean, currentUI: 'antd' | 'chakra' | 'material'}} param
 * @returns {import('webpack').Configuration}
 */
const ServerConfig = ({ entryPath, isDev, isSSR, isMiddleWareDevelop, isAnimationRouter, isCSR, currentUI }) => {
  const serverBase = BaseConfig({ env: "server" });
  const rules = rulesConfig({ env: "server", isDev });
  const output = outputConfig({ env: "server", isDev, isMiddleWareDevelop });
  const plugins = pluginsConfig({ env: "server", isDev, isAnimationRouter, isSSR, isCSR, isMiddleWareDevelop, currentUI });
  const externals = externalsConfig({ env: "server" });
  return merge(serverBase, {
    // 打包入口
    entry: {
      main: entryPath,
    },
    output,
    module: {
      rules,
    },
    plugins,
    externals,
  });
};

exports.ServerConfig = ServerConfig;
