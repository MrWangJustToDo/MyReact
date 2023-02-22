import { resolve } from "path";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const resolveConfig = ({ env }: SafeGenerateActionProps): Configuration["resolve"] => ({
  alias: {
    react: process.env.REACT === "react" ? "react" : "@my-react/react",
    "react-dom": process.env.REACT === "react" ? "react-dom" : "@my-react/react-dom",
    lodash: env === "client" ? "lodash-es" : "lodash",
    "lodash-es": env === "server" ? "lodash" : "lodash-es",
    "@build": resolve(process.cwd(), "build"),
    "@server": resolve(process.cwd(), "src", "server"),
    "@client": resolve(process.cwd(), "src", "client"),
    "@shared": resolve(process.cwd(), "src", "shared"),
  },
  extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
  fallback:
    env === "client"
      ? {
          path: false,
          fs: false,
        }
      : undefined,
});
