const { merge } = require("webpack-merge");
const { rulesConfig } = require("./rules");
const { outputConfig } = require("./output");
const { pluginsConfig } = require("./plugins");
const { externalsConfig } = require("./externals");
const { devServerConfig } = require("./devServer");
const { BaseConfig } = require("./webpack.base.config");
const { optimizationConfig } = require("./optimization");

/**
 *
 * @param {{entryPath: string, isDev: boolean, isSSR: boolean, isMiddleWareDevelop: boolean, isAnimationRouter: boolean, isCSR: boolean, currentUI: 'antd' | 'chakra' | 'material'}} param
 * @returns {import('webpack').Configuration}
 */
const ClientConfig = ({ entryPath, isDev, isSSR, isMiddleWareDevelop, isAnimationRouter, isCSR, currentUI }) => {
  const clientBase = BaseConfig({ env: "client", isDev });
  const rules = rulesConfig({ env: "client", isDev });
  const output = outputConfig({ env: "client", isDev, isMiddleWareDevelop });
  const plugins = pluginsConfig({ env: "client", isDev, isMiddleWareDevelop, isSSR, isCSR, isAnimationRouter, currentUI });
  const externals = externalsConfig({ env: "client" });
  const optimization = optimizationConfig({ env: "client", isDev, isMiddleWareDevelop });
  const devServer = devServerConfig({ publicPath: output.publicPath });
  return merge(clientBase, {
    // 控制显示source-map
    devtool: isDev ? "eval-cheap-module-source-map" : "hidden-source-map",
    // 打包入口
    entry: {
      main: isDev && isMiddleWareDevelop ? ["webpack-hot-middleware/client", entryPath] : entryPath,
    },
    // 输出入口
    output,
    module: {
      rules,
    },
    devServer,
    plugins,
    externals,
    optimization,
  });
};

exports.ClientConfig = ClientConfig;
