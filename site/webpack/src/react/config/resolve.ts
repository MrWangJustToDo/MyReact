import type { SafeGenerateActionPropsWithReact } from "..";
import type { Configuration } from "webpack";

export const resolveConfig = ({ env }: SafeGenerateActionPropsWithReact): Configuration["resolve"] => ({
  alias: {
    lodash: env === "client" ? "lodash-es" : "lodash",
    "lodash-es": env === "server" ? "lodash" : "lodash-es",
  },
  extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
  fallback:
    env === "client"
      ? {
          path: false,
          fs: false,
          stream: false,
        }
      : undefined,
});
