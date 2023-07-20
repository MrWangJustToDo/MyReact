const RefreshWebpackPlugin = require("./RefreshWebpackPlugin");

module.exports = function withNext(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = await originalEntry();

        if (entries["main.js"] && !entries["main.js"].includes(require.resolve("@my-react/react-refresh-tools/runtime"))) {
          entries["main.js"].unshift(require.resolve("@my-react/react-refresh-tools/runtime"));
        }

        return entries;
      };

      config.plugins.push(new RefreshWebpackPlugin());

      const { isServer, defaultLoaders } = options;

      // Disable package exports field resolution in webpack. It can lead
      // to dual package hazards where packages are imported twice: One
      // commonjs version and one ESM version. This breaks hooks which have
      // to rely on a singleton by design (nothing we can do about that).
      // See #25 and https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_dual_package_hazard
      // for more information.
      const webpackVersion = options.webpack.version;
      if (isServer && +webpackVersion.split(".")[0] >= 5) {
        config.resolve.exportsFields = [];
      }

      if (!defaultLoaders) {
        throw new Error("This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade");
      }

      // Move Preact into the framework chunk instead of duplicating in routes:
      const splitChunks = config.optimization && config.optimization.splitChunks;
      if (splitChunks && splitChunks.cacheGroups) {
        const cacheGroups = splitChunks.cacheGroups;
        const test = /[\\/]node_modules[\\/](@my-react|@my-react\/react-dom)[\\/]/;
        if (cacheGroups.framework) {
          cacheGroups["@my-react"] = Object.assign({}, cacheGroups.framework, {
            test,
          });
          // if you want to merge the 2 small commons+framework chunks:
          // cacheGroups.commons.name = 'framework';
        }
      }

      if (typeof nextConfig.webpack === 'function') {
        config = nextConfig.webpack(config, options);
      }

      // Install webpack aliases:
      const aliases = config.resolve.alias || (config.resolve.alias = {});
      aliases.react = "@my-react/react";
      aliases["react-dom$"] = "@my-react/react-dom";

      return config;
    },
  });
};
