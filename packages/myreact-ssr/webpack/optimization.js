// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const optimizationConfig = ({ env, isDev = true, isMiddleWareDevelop }) => {
  if (env === "client") {
    if (!isDev) {
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
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];

                switch (packageName) {
                  case "react":
                  case "react-dom":
                  case "react-router":
                  case "react-router-dom":
                  case "scheduler":
                  case "object-assign":
                    return "vendor-react";
                  case "@chakra-ui":
                  case "antd":
                    return "vendor-ui";
                  case "core-js":
                  case "core-js-pure":
                    return "vendor-core-js";
                  case "lodash":
                  case "lodash-es":
                    return "vendor-lodash";
                  default:
                    return "vendor";
                }
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
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];

              switch (packageName) {
                case "react":
                case "react-dom":
                case "react-router":
                case "react-router-dom":
                case "scheduler":
                case "object-assign":
                  return "vendor-react";
                case "@chakra-ui":
                case "antd":
                  return "vendor-ui";
                case "core-js":
                case "core-js-pure":
                  return "vendor-core-js";
                case "lodash":
                case "lodash-es":
                  return "vendor-lodash";
                default:
                  return "vendor";
              }
            },
          },
        },
      },
      runtimeChunk: {
        name: "runtime",
      },
    };
  }
};

exports.optimizationConfig = optimizationConfig;
