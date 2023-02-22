import { merge } from "webpack-merge";

import { externalsConfig } from "./config/externals";
import { outputConfig } from "./config/output";
import { pluginsConfig } from "./config/plugins";
import { rulesConfig } from "./config/rules";
import { BaseConfig } from "./webpack.base.config";

import type { SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const ServerConfig = (props: SafeGenerateActionProps): Partial<Configuration> => {
  const { isDEV, entry } = props;

  const serverBase = BaseConfig(props);
  const rules = rulesConfig(props);
  const output = outputConfig(props);
  const plugins = pluginsConfig(props);
  const externals = externalsConfig(props);
  return merge<Partial<Configuration>>(serverBase, {
    entry: {
      main: isDEV ? ["webpack/hot/poll?1000", entry] : entry,
    },
    output,
    module: {
      rules,
    },
    plugins,
    externals,
  });
};
