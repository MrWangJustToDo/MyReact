// 排除项
const nodeExternals = require("webpack-node-externals");

const externalsConfig = ({ env }) => {
  if (env === "server") {
    return [
      "react",
      "react-dom",
      "react-dom/server",
      "@loadable/component",
      nodeExternals({
        // load non-javascript files with extensions, presumably via loaders
        allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
      }),
    ];
  } else {
    return [{ react: "React" }, { "react-dom": "ReactDOM" }];
  }
};

exports.externalsConfig = externalsConfig;
