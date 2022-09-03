const path = require("path");

const resolveConfig = () => {
  const basePath = path.resolve(process.cwd());
  return {
    alias: {
      server: path.resolve(basePath, "src", "server"),
      client: path.resolve(basePath, "src", "client"),
      hooks: path.resolve(basePath, "src", "hooks"),
      router: path.resolve(basePath, "src", "router"),
      config: path.resolve(basePath, "src", "config"),
      module: path.resolve(basePath, "src", "module"),
      pages: path.resolve(basePath, "src", "pages"),
      utils: path.resolve(basePath, "src", "utils"),
      template: path.resolve(basePath, "src", "template"),
      components: path.resolve(basePath, "src", "components"),
      types: path.resolve(basePath, "src", "types"),
      store: path.resolve(basePath, "src", "store"),
      theme: path.resolve(basePath, "src", "theme"),
      webpackConfig: path.resolve(basePath, "webpack"),
      script: path.resolve(basePath, "script"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
  };
};

exports.resolveConfig = resolveConfig;
