import path from "path";
import nodeExternals from "webpack-node-externals";

import type { SafeGenerateActionProps } from "../type";

export const externalsConfig = ({ env }: SafeGenerateActionProps) =>
  env === "server"
    ? [
        nodeExternals({
          // load non-javascript files with extensions, presumably via loaders
          allowlist: [
            /\.(?!(?:jsx?|json)$).{1,5}$/i,
            "webpack/hot/poll?1000",
            "lodash-es",
            // "react",
            // "react-dom",
            // "react-dom/server",
            // "@my-react/react",
            // "@my-react/react-shared",
            // "@my-react/react-reactive",
            // "@my-react/react-reconciler",
            // "@my-react/react-dom",
            // "@my-react/react-jsx",
          ],
          additionalModuleDirs: [path.resolve(process.cwd(), "..", "..", "node_modules")],
        }),
      ]
    : [
        /* { react: "React" }, { "react-dom": "ReactDOM" }, { "@my-react/react-dom": "ReactDOM" }, { "@my-react/react": "React" } */
      ];
