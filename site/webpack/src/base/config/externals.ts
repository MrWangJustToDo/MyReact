// import nodeExternals from "webpack-node-externals";

import type { SafeGenerateActionProps } from "../type";

export const externalsConfig = ({ env }: SafeGenerateActionProps) =>
  env === "server"
    ? [
        // nodeExternals({
        //   // load non-javascript files with extensions, presumably via loaders
        //   allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, "webpack/hot/poll?1000", "lodash-es"],
        // }),
      ]
    : {};
