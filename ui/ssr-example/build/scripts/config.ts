import LoadablePlugin from "@loadable/webpack-plugin";
import RefreshWebpackPlugin from "@my-react/react-refresh-tools/RefreshWebpackPlugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { MANIFEST, definedWebpackConfig, WebpackNodeExternals } from "@site/webpack";
import dayjs from "dayjs";
import { resolve } from "path";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";

require("dayjs/locale/zh-cn");

dayjs.locale("zh-cn");

export const getConfig = () => {
  const multiConfig = definedWebpackConfig({
    serverEntry: process.env.SERVER_ENTRY!,
    clientEntry: process.env.CLIENT_ENTRY!,
    webpackClient: ({ env, isDEV, isSSR, isCSR, isMIDDLEWARE, BUNDLE_SCOPE, OUTPUT_SCOPE }) => {
      const isReact = process.env.REACT === "react";
      const isStream = process.env.STREAM === "true" && isSSR;
      const plugins = [
        !isStream && new LoadablePlugin({ filename: MANIFEST.manifest_loadable }),
        new DefinePlugin({
          __REACT__: isReact,
          __CLIENT__: env === "client",
          __SERVER__: env === "server",
          __SSR__: isSSR,
          __CSR__: isCSR,
          __STREAM__: isStream,
          __DEVELOPMENT__: isDEV,
          __MIDDLEWARE__: isMIDDLEWARE,
          __BASENAME__: JSON.stringify(process.env.BASENAME || ""),
          __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
          __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
          __BUILD_TIME__: JSON.stringify(dayjs().toString()),
        }),
        isDEV && (isReact ? new ReactRefreshPlugin() : new RefreshWebpackPlugin()),
        isDEV && isMIDDLEWARE && new HotModuleReplacementPlugin(),
      ].filter(Boolean);

      const resolveConfig = {
        alias: {
          react: isReact ? "react" : "@my-react/react",
          "react-dom": isReact ? "react-dom" : "@my-react/react-dom",
          "@build": resolve(process.cwd(), "build"),
          "@server": resolve(process.cwd(), "src", "server"),
          "@client": resolve(process.cwd(), "src", "client"),
          "@shared": resolve(process.cwd(), "src", "shared"),
        },
      };

      const arrayEntry = isDEV && !isReact ? { __refresh__: require.resolve("@my-react/react-refresh-tools/runtime") } : {};

      return {
        plugins,
        resolve: resolveConfig,
        entry: arrayEntry as Record<string, string>,
        resolveLoader: {
          modules: ["node_modules", resolve(process.cwd(), "..", "..", "site", "webpack", "node_modules")],
        },
      };
    },
    webpackServer: ({ env, isDEV, isCSR, isSSR, isMIDDLEWARE, BUNDLE_SCOPE, OUTPUT_SCOPE }) => {
      const isReact = process.env.REACT === "react";
      const isStream = process.env.STREAM === "true" && isSSR;
      const plugins = [
        !isStream && new LoadablePlugin({ filename: MANIFEST.manifest_loadable }),
        new DefinePlugin({
          __REACT__: isReact,
          __CLIENT__: env === "client",
          __SERVER__: env === "server",
          __SSR__: isSSR,
          __CSR__: isCSR,
          __STREAM__: isStream,
          __DEVELOPMENT__: isDEV,
          __MIDDLEWARE__: isMIDDLEWARE,
          __BASENAME__: JSON.stringify(process.env.BASENAME || ""),
          __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
          __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
          __BUILD_TIME__: JSON.stringify(dayjs().toString()),
        }),
        isDEV && !isMIDDLEWARE && new HotModuleReplacementPlugin(),
      ].filter(Boolean);

      const resolveConfig = {
        alias: {
          // react: isReact ? "react" : "@my-react/react",
          // "react-dom": isReact ? "react-dom" : "@my-react/react-dom",
          "@build": resolve(process.cwd(), "build"),
          "@server": resolve(process.cwd(), "src", "server"),
          "@client": resolve(process.cwd(), "src", "client"),
          "@shared": resolve(process.cwd(), "src", "shared"),
        },
      };

      return {
        plugins,
        resolve: resolveConfig,
        externals: [
          WebpackNodeExternals({
            allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, "webpack/hot/poll?1000", "lodash-es"],
          }),
        ],
        resolveLoader: {
          modules: ["node_modules", resolve(process.cwd(), "..", "..", "site", "webpack", "node_modules")],
        },
      };
    },
  });

  return multiConfig;
};
