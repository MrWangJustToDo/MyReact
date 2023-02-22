import { merge } from "webpack-merge";

import { externalsConfig } from "./config";
import { devServerConfig } from "./config/devServer";
import { optimizationConfig } from "./config/optimization";
import { outputConfig } from "./config/output";
import { pluginsConfig } from "./config/plugins";
import { rulesConfig } from "./config/rules";
import { BaseConfig } from "./webpack.base.config";

import type { SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const ClientConfig = (props: SafeGenerateActionProps): Partial<Configuration> => {
  const { isDEV, isMIDDLEWARE, entry } = props;

  const clientBase = BaseConfig(props);
  const rules = rulesConfig(props);
  const output = outputConfig(props);
  const externals = externalsConfig(props);
  const plugins = pluginsConfig(props);
  const optimization = optimizationConfig(props);
  const devServer = devServerConfig({
    publicPath: output?.publicPath as string,
    ...props,
  });
  return merge<Partial<Configuration>>(clientBase, {
    devtool: isDEV ? "eval-cheap-module-source-map" : "hidden-source-map",
    entry: {
      main: isDEV && isMIDDLEWARE ? ["webpack-hot-middleware/client", entry] : entry,
    },
    output,
    module: {
      rules,
    },
    externals,
    devServer,
    plugins,
    optimization,
  });
};