const path = require("path");
// worker 执行
const threadLoader = require("thread-loader");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssRules = (env, isDev = true) => {
  // css no module
  return {
    test: /\.s?css$/,
    use: [
      env === "client" && (isDev ? { loader: "style-loader" } : { loader: MiniCssExtractPlugin.loader }),
      { loader: "css-loader" },
      { loader: "postcss-loader" },
      { loader: "sass-loader" },
    ].filter(Boolean),
    exclude: /\.module\.s?css$/,
  };
};

const jsRules = (env, isDev = true) => {
  const workerPool = {
    workers: 3,
    poolTimeout: isDev ? Infinity : 2000,
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
      {
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: true,
          plugins:
            env === "client"
              ? [
                  [
                    "import",
                    {
                      libraryName: "antd",
                      libraryDirectory: "lib",
                      style: "css", // 样式按需加载
                    },
                  ],
                  isDev && "react-refresh/babel",
                ].filter(Boolean)
              : ["@babel/transform-modules-commonjs"],
        },
      },
    ],
  };
};

const cssModuleRules = (env, isDev = true) => {
  // css module
  return {
    test: /\.module\.s?css$/,
    use: [
      // 分离打包css文件
      env === "client" &&
        (isDev
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
            localIdentName: isDev ? "[name]__[local]--[hash:base64:5]" : "[contenthash:base64:6]",
            // ssr 模式下导出className标识符
            exportOnlyLocals: env === "client" ? false : true,
          },
        },
      },
      // 启用can i use中不同浏览器前缀支持
      { loader: "postcss-loader" },
      // 启用sass支持
      { loader: "sass-loader" },
    ].filter(Boolean),
    exclude: [path.resolve(process.cwd(), "node_modules")],
  };
};

const resourceRules = (env, isDev = true) => {
  return {
    test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif|ico)(\?v=\d+\.\d+\.\d+)?$/,
    // 使用file-loader可以选择是否生成文件
    // type: "asset/resource",
    loader: "file-loader",
    options: {
      name: isDev ? "[name]-[hash].[ext]" : "[name]-[contenthash].[ext]",
      esModule: false,
      // 是否生成文件
      emitFile: env === "client" ? true : false,
    },
  };
};

const rulesConfig = ({ env, isDev }) => [cssRules(env, isDev), jsRules(env, isDev), cssModuleRules(env, isDev), resourceRules(env, isDev)];

exports.rulesConfig = rulesConfig;
