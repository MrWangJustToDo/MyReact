import path from "path";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

const outputPath = (env: "server" | "client", isDEV: boolean, bundleScope: string, outputScope: string) =>
  path.resolve(process.cwd(), bundleScope, isDEV ? "dev" : "dist", outputScope, env);

export const outputConfig = ({
  env,
  isDEV,
  isMIDDLEWARE,
  DEV_HOST,
  WDS_PORT,
  PROD_HOST,
  PROD_PORT,
  BUNDLE_SCOPE,
  OUTPUT_SCOPE,
}: SafeGenerateActionProps): Configuration["output"] => {
  const _OUTPUT_SCOPE__ = OUTPUT_SCOPE && !OUTPUT_SCOPE.endsWith("/") ? `${OUTPUT_SCOPE}/` : OUTPUT_SCOPE;
  return env === "client"
    ? {
        clean: true,
        // 输出路径
        path: outputPath(env, Boolean(isDEV), BUNDLE_SCOPE, OUTPUT_SCOPE),
        // 输出文件名
        filename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 按需加载的chunk名
        chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 引入资源的url路径
        publicPath: isDEV ? (isMIDDLEWARE ? "/dev/" : `http://${DEV_HOST}:${WDS_PORT}/dev/`) : `http://${PROD_HOST}:${PROD_PORT}/${_OUTPUT_SCOPE__}client/`,
      }
    : {
        clean: true,
        path: outputPath(env, Boolean(isDEV), BUNDLE_SCOPE, OUTPUT_SCOPE),
        // 输出文件名
        filename: "app.js",
        // 按需加载的chunk名
        chunkFilename: isDEV ? "[name].js" : "[name]-[contenthash].js",
        // 引入资源的url路径
        publicPath: isDEV ? (isMIDDLEWARE ? "/dev/" : `http://${DEV_HOST}:${WDS_PORT}/dev/`) : `http://${PROD_HOST}:${PROD_PORT}/${_OUTPUT_SCOPE__}client/`,
        library: {
          type: "commonjs2",
        },
      };
};
