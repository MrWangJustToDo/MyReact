import path from "path";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const commonConfig = ({ env, isDEV }: SafeGenerateActionProps): Partial<Configuration> => ({
  name: env,
  mode: (isDEV ? "development" : "production") as "development" | "production",
  target: env === "client" ? "web" : "node16",
  context: path.resolve(process.cwd()),
  externalsPresets: env === "server" ? { node: true } : { web: true },
});
