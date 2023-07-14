import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path, { resolve } from "path";

import type { SafeGenerateActionProps } from "../type";
import type { RuleSetRule, RuleSetUseItem } from "webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const threadLoader = require("thread-loader");

const cssRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
  test: /\.s?css$/,
  use: [
    env === "client" && (isDEV ? { loader: "style-loader" } : { loader: MiniCssExtractPlugin.loader }),
    { loader: "css-loader" },
    { loader: "postcss-loader" },
    { loader: "sass-loader" },
  ].filter(Boolean) as RuleSetUseItem[],
  exclude: /\.module\.s?css$/,
});

const jsRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => {
  const workerPool = {
    workers: 3,
    poolTimeout: isDEV ? Infinity : 2000,
  };

  threadLoader.warmup(workerPool, ["babel-loader"]);

  return {
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve("thread-loader"),
        options: workerPool,
      },
      isDEV && env === "client" && process.env.REACT === "myreact" && require.resolve("@my-react/react-refresh-tools/loader"),
      {
        loader: "babel-loader",
        options: {
          // https://github.com/babel/babel/issues/8900
          sourceType: "unambiguous",
          cacheDirectory: true,
          configFile: resolve(process.cwd(), "babel.config.js"),
          plugins: env === "client" ? [isDEV && (process.env.REACT === "react" ? "react-refresh/babel" : "@my-react/react-refresh/babel")].filter(Boolean) : [],
        },
      },
    ],
  };
};

const cssModuleRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
  test: /\.module\.s?css$/,
  use: [
    // 分离打包css文件
    env === "client" &&
      (isDEV
        ? { loader: "style-loader" }
        : {
            loader: MiniCssExtractPlugin.loader,
          }),
    // 启用js中import css为对象，启用css module以及生成的类名
    {
      loader: "css-loader",
      options: {
        importLoaders: 2,
        modules: {
          mode: "local",
          localIdentName: isDEV ? "[name]__[local]--[hash:base64:5]" : "[contenthash:base64:6]",
          // ssr 模式下导出className标识符
          exportOnlyLocals: env === "client" ? false : true,
        },
      },
    },
    // 启用can i use中不同浏览器前缀支持
    { loader: "postcss-loader" },
    // 启用sass支持
    { loader: "sass-loader" },
  ].filter(Boolean) as RuleSetUseItem[],
  exclude: [path.resolve(process.cwd(), "node_modules")],
});

const resourceRules = ({ env, isDEV }: SafeGenerateActionProps): RuleSetRule => ({
  test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif|ico)(\?v=\d+\.\d+\.\d+)?$/,
  loader: "file-loader",
  options: {
    name: isDEV ? "[name]-[hash].[ext]" : "[name]-[contenthash].[ext]",
    esModule: false,
    // 是否生成文件
    emitFile: env === "client" ? true : false,
  },
  type: "javascript/auto",
});

export const rulesConfig = (props: SafeGenerateActionProps): RuleSetRule[] => {
  return [cssRules(props), jsRules(props), cssModuleRules(props), resourceRules(props)].filter(Boolean) as RuleSetRule[];
};
