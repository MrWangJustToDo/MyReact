import LoadablePlugin from "@loadable/webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

import { MANIFEST } from "../utils";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const pluginsConfig = ({ env, isDEV, isSSR, isCSR, isMIDDLEWARE, ui }: SafeGenerateActionProps): Configuration["plugins"] =>
  [
    env === "client" &&
      new WebpackManifestPlugin({
        fileName: isDEV ? MANIFEST.manifest_dev : MANIFEST.manifest_prod,
      }),
    env === "client" && new LoadablePlugin({ filename: MANIFEST.manifest_loadable }),
    new DefinePlugin({
      __UI__: JSON.stringify(ui),
      __SSR__: isSSR,
      __CSR__: isCSR,
      __CLIENT__: env === "client",
      __SERVER__: env === "server",
      __DEVELOPMENT__: isDEV,
      __MIDDLEWARE__: isMIDDLEWARE,
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    }),
    env === "client" &&
      new MiniCssExtractPlugin({
        filename: isDEV ? "[name].css" : "[name]-[contenthash].css",
        chunkFilename: isDEV ? "[name]-[id].css" : "[name]-[id]-[contenthash].css",
      }),
    env === "client" && isDEV && new ReactRefreshPlugin(),
    env === "client" && isDEV && isMIDDLEWARE && new HotModuleReplacementPlugin(),
    env === "server" && isDEV && !isMIDDLEWARE && new HotModuleReplacementPlugin(),
    env === "client" &&
      isDEV &&
      new ForkTsCheckerWebpackPlugin({
        async: false,
      }),
    env === "client" &&
      isDEV &&
      new ESLintWebpackPlugin({
        extensions: ["js", "jsx", "ts", "tsx"],
        quiet: true,
      }),
  ].filter(Boolean) as Configuration["plugins"];
