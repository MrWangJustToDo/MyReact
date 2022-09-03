const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 输出所有资源路径
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// loadable json
const LoadablePlugin = require("@loadable/webpack-plugin");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 快速刷新
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// 打包阶段错误检查
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
// 查看打包
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const pluginsConfig = ({ env, isDev = true, isSSR = true, isMiddleWareDevelop = false, isAnimationRouter = false, isCSR = false, currentUI }) => {
  return [
    new CleanWebpackPlugin(),
    env === "client" && new LoadablePlugin({ filename: "manifest-loadable.json" }),
    env === "client" && new WebpackManifestPlugin({ fileName: isDev ? "manifest-dev.json" : "manifest-prod.json" }),
    new webpack.DefinePlugin({
      __SSR__: isSSR,
      __CSR__: isCSR, // pure client render
      __CLIENT__: env === "client",
      __SERVER__: env === "server",
      __DEVELOPMENT__: isDev,
      __UI__: JSON.stringify(currentUI),
      __MIDDLEWARE__: isMiddleWareDevelop,
      __ANIMATE_ROUTER__: isAnimationRouter,
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    }),
    env === "client" &&
      new MiniCssExtractPlugin({
        filename: isDev ? "[name].css" : "[name]-[contenthash].css",
        chunkFilename: isDev ? "css/[id].css" : "[id].[contenthash].css",
      }),
    // 快速刷新
    env === "client" && isDev && new ReactRefreshPlugin(),
    // 对于 webpack-hot-middleware必须启用
    env === "client" && isDev && isMiddleWareDevelop && new webpack.HotModuleReplacementPlugin(),
    // 检查错误
    // env === "client" &&
    //   new ForkTsCheckerWebpackPlugin({
    //     async: false,
    //   }),
    // env === "client" &&
    //   new ESLintPlugin({
    //     extensions: ["js", "jsx", "ts", "tsx"],
    //     quiet: true,
    //   }),
    // 查看打包
    // env === "client" && new BundleAnalyzerPlugin(),
  ].filter(Boolean);
};

exports.pluginsConfig = pluginsConfig;
