import { merge } from "webpack-merge";

import { definedUniversalWebpackConfig as _definedUniversalWebpackConfig } from "../base";
import { outputConfig } from "../base/config";

import { devServerConfig, optimizationConfig, pluginsConfig, resolveConfig, rulesConfig } from "./config";

import type { SafeDefineUniversalWebpackConfigPropsWithReact, SafeGenerateActionPropsWithReact } from "./type";

export const definedUniversalWebpackConfig = (config: SafeDefineUniversalWebpackConfigPropsWithReact) => {
  return _definedUniversalWebpackConfig({
    ...config,
    webpackClient: (props: SafeGenerateActionPropsWithReact) => {
      const rules = rulesConfig(props);
      const resolve = resolveConfig(props);
      const plugins = pluginsConfig(props);
      const optimization = optimizationConfig(props);
      const output = outputConfig(props);
      const devServer = devServerConfig({
        publicPath: output.publicPath as string,
        ...props,
      });

      const externalWebpackClient = config.webpackClient?.(props) || {};

      return merge(
        {
          resolve,
          module: {
            rules,
          },
          devServer,
          plugins,
          optimization,
        },
        externalWebpackClient
      );
    },
    webpackServer: (props: SafeGenerateActionPropsWithReact) => {
      const rules = rulesConfig(props);
      const resolve = resolveConfig(props);
      const plugins = pluginsConfig(props);

      const externalWebpackServer = config.webpackServer?.(props) || {};

      return merge(
        {
          resolve,
          module: {
            rules,
          },
          plugins,
        },
        externalWebpackServer
      );
    },
  });
};

export * from "./type";
