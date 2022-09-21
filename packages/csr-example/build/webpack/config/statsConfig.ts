import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const statsConfig = ({ env, isDEV }: SafeGenerateActionProps): Configuration["stats"] => {
  return isDEV || env === "server" ? "errors-only" : "normal";
};
