import LoadablePlugin from "@loadable/webpack-plugin";
import RefreshWebpackPlugin from "@my-react/react-refresh-tools/RefreshWebpackPlugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { MANIFEST, WebpackNodeExternals, definedWebpackConfig } from "@site/webpack";
import { resolve } from "path";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";

export const getConfig = () => {
  const multiConfig = definedWebpackConfig({
    serverEntry: process.env.SERVER_ENTRY!,
    clientEntry: process.env.CLIENT_ENTRY!,
    webpackClient: ({ env, isDEV, isSSR, isCSR, isMIDDLEWARE, BUNDLE_SCOPE, OUTPUT_SCOPE }) => {
      const isReact = process.env.REACT === "react";
      const plugins = [
        new LoadablePlugin({ filename: MANIFEST.manifest_loadable }),
        new DefinePlugin({
          __REACT__: isReact,
          __CLIENT__: env === "client",
          __SERVER__: env === "server",
          __SSR__: isSSR,
          __CSR__: isCSR,
          __DEVELOPMENT__: isDEV,
          __MIDDLEWARE__: isMIDDLEWARE,
          __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
          __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
          __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
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
        resolve: { ...resolveConfig, fallback: { http: false, https: false, vm: false } },
        entry: arrayEntry as Record<string, string>,
        resolveLoader: {
          modules: ["node_modules", resolve(process.cwd(), "..", "..", "site", "webpack", "node_modules")],
        },
      };
    },
    webpackServer: ({ env, isDEV, isCSR, isSSR, isMIDDLEWARE, BUNDLE_SCOPE, OUTPUT_SCOPE }) => {
      const isReact = process.env.REACT === "react";
      const plugins = [
        new LoadablePlugin({ filename: MANIFEST.manifest_loadable }),
        new DefinePlugin({
          __REACT__: isReact,
          __CLIENT__: env === "client",
          __SERVER__: env === "server",
          __SSR__: isSSR,
          __CSR__: isCSR,
          __DEVELOPMENT__: isDEV,
          __MIDDLEWARE__: isMIDDLEWARE,
          __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
          __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
          __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
        }),
        isDEV && !isMIDDLEWARE && new HotModuleReplacementPlugin(),
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

      return {
        plugins,
        resolve: resolveConfig,
        externals: [
          WebpackNodeExternals({
            allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, "webpack/hot/poll?1000", "lodash-es", "react", "react-dom", "react-dom/server"],
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
