const path = require("path");

const outputPath = (env, isDev) => path.resolve(process.cwd(), isDev ? "dev" : "dist", env);

const outputConfig = ({ env, isDev = true, isMiddleWareDevelop }) => {
  if (env === "client") {
    return {
      // 输出路径
      path: outputPath(env, isDev),
      // 输出文件名
      filename: isDev ? "[name].js" : "[name]-[contenthash].js",
      // 按需加载的chunk名
      chunkFilename: isDev ? "[name].js" : "[name]-[contenthash].js",
      // 引入资源的url路径
      publicPath: isDev
        ? isMiddleWareDevelop
          ? "/dev/"
          : `http://${process.env.DEV_HOST}:${process.env.WDS_PORT}/dev/`
        : `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
      // 打包资源的名称
      // assetModuleFilename: "[hash].[ext]",
    };
  } else {
    return {
      // 输出路径
      path: outputPath(env, isDev),
      // 输出文件名
      filename: "app.js",
      // 按需加载的chunk名
      chunkFilename: isDev ? "[name].js" : "[name]-[contenthash].js",
      // 引入资源的url路径
      publicPath: isDev
        ? isMiddleWareDevelop
          ? "/dev/"
          : `http://${process.env.DEV_HOST}:${process.env.WDS_PORT}/dev/`
        : `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
      // 打包资源的名称
      // assetModuleFilename: "[hash].[ext]",
      library: {
        type: "commonjs2",
      },
    };
  }
};

exports.outputConfig = outputConfig;
