import MiniCssExtractPlugin from "mini-css-extract-plugin";

import type { SafeGenerateActionPropsWithReact } from "..";
import type { Configuration } from "webpack";

export const pluginsConfig = ({ env, isDEV }: SafeGenerateActionPropsWithReact): Configuration["plugins"] =>
  [
    env === "client" &&
      new MiniCssExtractPlugin({
        filename: isDEV ? "[name].css" : "[name]-[contenthash].css",
        chunkFilename: isDEV ? "[name]-[id].css" : "[name]-[id]-[contenthash].css",
      }),
  ].filter(Boolean) as Configuration["plugins"];
