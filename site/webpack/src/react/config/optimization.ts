import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

import type { SafeGenerateActionPropsWithReact } from "..";
import type { Configuration } from "webpack";

const splitChunk = (packageArray: string[]) => {
  if (!packageArray) return "vendor";
  if (!packageArray[1]) return "vendor";
  const pnpmPackages = packageArray[1];
  if (pnpmPackages.includes("/core-js")) return "vendor-core-js";
  if (pnpmPackages.includes("/@chakra-ui")) return "vendor-ui";
  if (pnpmPackages.includes("/@babel")) return "vendor-babel";
  if (pnpmPackages.includes("@emotion")) return "vendor-emotion";
  if (pnpmPackages.includes('/react-icons')) return 'vendor-icons'
  if (pnpmPackages.includes("/react")) return "vendor-react";
  if (pnpmPackages.includes("/lodash")) return "vendor-lodash";
  return "vendor";
};

export const optimizationConfig = ({ env, isDEV }: SafeGenerateActionPropsWithReact): Configuration["optimization"] => {
  if (env === "client") {
    if (!isDEV) {
      return {
        minimizer: ["...", new CssMinimizerPlugin()],
        moduleIds: "deterministic",
        splitChunks: {
          minChunks: 2,
          minSize: 30000,

          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              enforce: true,
              chunks: "all",
              name(module: { context: string }) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*)/);
                return splitChunk(packageName);
              },
            },
          },
        },
        runtimeChunk: {
          name: "runtime",
        },
      };
    }
    return {
      splitChunks: {
        minChunks: 2,
        minSize: 30000,

        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            enforce: true,
            chunks: "all",
            name(module: { context: string }) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*)/);
              return splitChunk(packageName);
            },
          },
        },
      },
      runtimeChunk: {
        name: "runtime-dev",
      },
    };
  }
};
