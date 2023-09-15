import { commonConfig } from "./config/common";
import { statsConfig } from "./config/statsConfig";

import type { SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const BaseConfig = (props: SafeGenerateActionProps): Partial<Configuration> => ({
  ...commonConfig(props),
  stats: statsConfig(props),
  infrastructureLogging: {
    level: "error" as const,
  },
});
