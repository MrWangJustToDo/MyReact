const RefreshWebpackPlugin = require("./RefreshWebpackPlugin");

/**
 * @typedef {import("next").NextConfig} NextConfig
 */

/**
 * @typedef {{
 *  isServer?: boolean,
 *  webpackVersion?: string,
 *  isTurbopack?: boolean,
 *  isClient?: boolean
 * }} GenerateAliasContext
 */

/**
 * @typedef {Record<string, string | { browser?: string }>} AliasMap
 */

/**
 * @typedef {"client" | "both"} AliasScope
 */

/**
 * @typedef {{
 *  generateAlias?: (aliases: AliasMap, context: GenerateAliasContext) => void,
 *  turbopackKey?: "turbopack" | "experimental.turbopack" | "experimental.turbo",
 *  aliasScope?: AliasScope
 * }} WithNextOptions
 */

/**
 * Detect which turbopack config key to use based on the user's nextConfig.
 *
 * - "turbopack"             → Next.js 16+  (top-level key)
 * - "experimental.turbopack" → Next.js 15   (experimental key)
 * - "experimental.turbo"     → Next.js 13-14 (legacy key)
 * - null                    → no turbopack keys found, skip
 */
/**
 * @param {NextConfig} nextConfig
 * @returns {"turbopack" | "experimental.turbopack" | "experimental.turbo" | null}
 */
function detectTurbopackKey(nextConfig) {
  if (nextConfig.turbopack) return "turbopack";
  if (nextConfig.experimental?.turbopack) return "experimental.turbopack";
  if (nextConfig.experimental?.turbo) return "experimental.turbo";
  return null;
}

/**
 * @param {NextConfig} nextConfig
 * @param {WithNextOptions["generateAlias"]} generateAlias
 * @param {{ clientOnly?: boolean }} [options]
 * @returns {AliasMap}
 */
function getDefaultAliases({ isTurbopack }) {
  if (isTurbopack) {
    return {
      "react/compiler-runtime": "@my-react/react/compiler-runtime",
      "react/jsx-runtime": "@my-react/react/jsx-runtime",
      "react/jsx-dev-runtime": "@my-react/react/jsx-dev-runtime",
      react: "@my-react/react-refresh-tools/react-turbopack",
      "react-dom": "@my-react/react-dom",
      "react-dom/server": "@my-react/react-dom/server",
      "react-dom/client": "@my-react/react-dom/client",
    };
  }

  return {
    "react/compiler-runtime": "@my-react/react/compiler-runtime",
    react: "@my-react/react",
    "react-dom$": "@my-react/react-dom",
    "react-dom/server$": "@my-react/react-dom/server",
    "react-dom/client$": "@my-react/react-dom/client",
  };
}

function wrapClientAliases(aliases) {
  Object.keys(aliases).forEach((key) => {
    const value = aliases[key];
    if (typeof value === "string") {
      aliases[key] = { browser: value };
    }
  });
}

/**
 * @param {WithNextOptions["generateAlias"]} generateAlias
 * @param {{ aliasScope: AliasScope }} options
 * @returns {AliasMap}
 */
function buildTurbopackAliases(generateAlias, { aliasScope }) {
  const aliases = {};
  const isClientOnly = aliasScope !== "both";

  if (typeof generateAlias === "function") {
    generateAlias(aliases, { isTurbopack: true, isClient: isClientOnly });
  } else {
    Object.assign(aliases, getDefaultAliases({ isTurbopack: true }));
  }

  if (isClientOnly) {
    wrapClientAliases(aliases);
  }

  return aliases;
}

/**
 * @param {NextConfig} config
 * @param {NextConfig} nextConfig
 * @param {WithNextOptions["generateAlias"]} generateAlias
 * @param {WithNextOptions["turbopackKey"]} turbopackKey
 * @param {AliasScope} aliasScope
 * @returns {NextConfig}
 */
function applyTurbopackConfig(config, nextConfig, generateAlias, turbopackKey, aliasScope) {
  const key = turbopackKey || detectTurbopackKey(nextConfig);
  if (!key) return config;

  const aliases = buildTurbopackAliases(generateAlias, { aliasScope });

  if (key === "turbopack") {
    // Next.js 16+: top-level `turbopack` key
    config.turbopack = Object.assign({}, nextConfig.turbopack, {
      resolveAlias: Object.assign({}, nextConfig.turbopack?.resolveAlias, aliases),
    });
  } else if (key === "experimental.turbopack") {
    // Next.js 15: `experimental.turbopack`
    config.experimental = Object.assign({}, nextConfig.experimental, {
      turbopack: Object.assign({}, nextConfig.experimental?.turbopack, {
        resolveAlias: Object.assign({}, nextConfig.experimental?.turbopack?.resolveAlias, aliases),
      }),
    });
  } else if (key === "experimental.turbo") {
    // Next.js 13-14: `experimental.turbo`
    config.experimental = Object.assign({}, nextConfig.experimental, {
      turbo: Object.assign({}, nextConfig.experimental?.turbo, {
        resolveAlias: Object.assign({}, nextConfig.experimental?.turbo?.resolveAlias, aliases),
      }),
    });
  }

  return config;
}

/**
 * @param {NextConfig} config
 * @param {NextConfig} nextConfig
 * @param {WithNextOptions["generateAlias"]} generateAlias
 * @param {AliasScope} aliasScope
 * @param {Record<string, unknown>} options
 * @returns {NextConfig}
 */
function applyWebpackConfig(config, nextConfig, generateAlias, aliasScope, options) {
  const originalEntry = config.entry;

  if (options.dev) {
    config.entry = async () => {
      const entries = await originalEntry();

      if (entries["main.js"] && !entries["main.js"].includes(require.resolve("@my-react/react-refresh-tools/runtime"))) {
        entries["main.js"].unshift(require.resolve("@my-react/react-refresh-tools/runtime"));
      }

      return entries;
    };

    config.plugins.push(new RefreshWebpackPlugin());
  }

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

  if (typeof nextConfig.webpack === "function") {
    config = nextConfig.webpack(config, options);
  }

  // Install webpack aliases:
  const aliases = config.resolve.alias || (config.resolve.alias = {});
  const applyDefaultAliases = aliasScope === "both" || !isServer;

  if (applyDefaultAliases) {
    if (typeof generateAlias === "function") {
      generateAlias(aliases, { isServer, webpackVersion });
    } else {
      Object.assign(aliases, getDefaultAliases({ isTurbopack: false }));
    }
  }

  return config;
}

/**
 * @param {NextConfig} [nextConfig]
 * @param {WithNextOptions} [options]
 * @returns {NextConfig}
 */
module.exports = function withNext(nextConfig = {}, { generateAlias, turbopackKey, aliasScope = "client" } = {}) {
  const resolvedAliasScope = aliasScope;
  const result = Object.assign({}, nextConfig, {
    // Webpack configuration (used when --webpack flag is provided)
    webpack: (config, options) => applyWebpackConfig(config, nextConfig, generateAlias, resolvedAliasScope, options),
  });

  // Apply turbopack config under the correct key for the detected Next.js version
  applyTurbopackConfig(result, nextConfig, generateAlias, turbopackKey, resolvedAliasScope);

  return result;
};
