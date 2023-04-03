import { resolve } from "path";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const resolveConfig = ({ env }: SafeGenerateActionProps): Configuration["resolve"] => ({
  alias: {
    react: process.env.REACT === "myreact" && env === "client" ? "@my-react/react" : "react",
    "react-dom": process.env.REACT === "myreact" && env === "client" ? "@my-react/react-dom" : "react-dom",
    "react-refresh": process.env.REACT === "myreact" && env === "client" ? "@my-react/react-refresh" : "react-refresh",
    "react-refresh/babel": process.env.REACT === "myreact" && env === "client" ? "@my-react/react-refresh/babel" : "react-refresh/babel",
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
          stream: false,
        }
      : undefined,
});
