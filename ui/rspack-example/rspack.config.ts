import { ReactRefreshRspackPlugin } from "@my-react/react-rspack";
import { defineConfig } from "@rspack/cli";
import { type SwcLoaderOptions, rspack } from "@rspack/core";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  entry: {
    main: "./src/index.tsx",
  },
  target: ["browserslist:last 2 versions, > 0.2%, not dead, Firefox ESR"],
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.css$/,
        type: "css/auto",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
            } satisfies SwcLoaderOptions,
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    isDev ? new ReactRefreshRspackPlugin() : null,
  ],
});
