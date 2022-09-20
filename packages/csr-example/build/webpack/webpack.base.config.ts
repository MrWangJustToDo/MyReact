import { commonConfig } from "./config/common";
import { resolveConfig } from "./config/resolve";
import { statsConfig } from "./config/statsConfig";

import type { SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const BaseConfig = (props: SafeGenerateActionProps): Partial<Configuration> => ({
  ...commonConfig(props),
  resolve: resolveConfig(props),
  stats: statsConfig(props),
  infrastructureLogging: {
    level: "error" as const,
  },
});
