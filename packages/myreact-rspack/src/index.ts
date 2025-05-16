import path from "node:path";

import { normalizeOptions } from "./options";
import { reactRefreshPath, refreshUtilsPath, runtimePaths } from "./paths";
import { getAdditionalEntries } from "./utils/getAdditionalEntries";
import { getIntegrationEntry } from "./utils/getIntegrationEntry";
import { type IntegrationType, getSocketIntegration } from "./utils/getSocketIntegration";

import type { NormalizedPluginOptions, PluginOptions } from "./options";
import type { Compiler } from "@rspack/core";

export type { PluginOptions };

function addEntry(entry: string, compiler: Compiler) {
  new compiler.webpack.EntryPlugin(compiler.context, entry, {
    name: undefined,
  }).apply(compiler);
}

function addSocketEntry(sockIntegration: IntegrationType, compiler: Compiler) {
  const integrationEntry = getIntegrationEntry(sockIntegration);

  if (integrationEntry) {
    addEntry(integrationEntry, compiler);
  }
}

const PLUGIN_NAME = "RefreshRspackPlugin";

class RefreshRspackPlugin {
  options: NormalizedPluginOptions;

  static deprecated_runtimePaths = runtimePaths;
  static loader = "builtin:react-refresh-loader";

  constructor(options: PluginOptions = {}) {
    this.options = normalizeOptions(options);
  }

  apply(compiler: Compiler) {
    if (
      // Webpack do not set process.env.NODE_ENV, so we need to check for mode.
      // Ref: https://github.com/webpack/webpack/issues/7074
      (compiler.options.mode !== "development" ||
        // We also check for production process.env.NODE_ENV,
        // in case it was set and mode is non-development (e.g. 'none')
        (process.env && process.env.NODE_ENV === "production")) &&
      !this.options.forceEnable
    ) {
      compiler.options.resolve.alias = {
        ...compiler.options.resolve.alias,
        react: "@my-react/react",
        "react-dom$": "@my-react/react-dom",
        "react-dom/server$": "@my-react/react-dom/server",
        "react-dom/client$": "@my-react/react-dom/client",
        "react/jsx-runtime$": "@my-react/react/jsx-runtime",
        "react/jsx-dev-runtime$": "@my-react/react/jsx-dev-runtime",
      };
      return;
    }
    const addEntries = getAdditionalEntries({
      devServer: compiler.options.devServer,
      options: this.options,
    });

    if (this.options.injectEntry) {
      for (const entry of addEntries.prependEntries) {
        addEntry(entry, compiler);
      }
    }

    if (this.options.overlay !== false && this.options.overlay.sockIntegration) {
      addSocketEntry(this.options.overlay.sockIntegration, compiler);
    }

    for (const entry of addEntries.overlayEntries) {
      addEntry(entry, compiler);
    }

    new compiler.webpack.ProvidePlugin({
      $ReactRefreshRuntime$: reactRefreshPath,
    }).apply(compiler);

    if (this.options.injectLoader) {
      compiler.options.module.rules.unshift({
        // biome-ignore lint: exists
        include: this.options.include!,
        exclude: {
          // biome-ignore lint: exists
          or: [this.options.exclude!, [...runtimePaths]].filter(Boolean),
        },
        resourceQuery: this.options.resourceQuery,
        use: RefreshRspackPlugin.loader,
      });
    }

    const definedModules: Record<string, string | boolean> = {
      // For Multiple Instance Mode
      __my_react_refresh_library__: JSON.stringify(
        compiler.webpack.Template.toIdentifier(this.options.library || compiler.options.output.uniqueName || compiler.options.output.library)
      ),
    };
    const providedModules: Record<string, string> = {
      __my_react_refresh_utils__: refreshUtilsPath,
    };
    if (this.options.overlay === false) {
      // Stub errorOverlay module so their calls can be erased
      definedModules.__my_react_refresh_error_overlay__ = false;
      definedModules.__my_react_refresh_socket__ = false;
    } else {
      if (this.options.overlay.module) {
        providedModules.__my_react_refresh_error_overlay__ = require.resolve(this.options.overlay.module);
      }

      if (this.options.overlay.sockIntegration) {
        providedModules.__my_react_refresh_socket__ = getSocketIntegration(this.options.overlay.sockIntegration);
      }
    }
    new compiler.webpack.DefinePlugin(definedModules).apply(compiler);
    new compiler.webpack.ProvidePlugin(providedModules).apply(compiler);

    const refreshPath = path.dirname(require.resolve("@my-react/react-refresh"));
    compiler.options.resolve.alias = {
      "react-refresh": refreshPath,
      "@my-react/react-refresh": refreshPath,
      ...compiler.options.resolve.alias,
      react: "@my-react/react",
      "react-dom$": "@my-react/react-dom",
      "react-dom/server$": "@my-react/react-dom/server",
      "react-dom/client$": "@my-react/react-dom/client",
      "react/jsx-runtime$": "@my-react/react/jsx-runtime",
      "react/jsx-dev-runtime$": "@my-react/react/jsx-dev-runtime",
    };

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.additionalTreeRuntimeRequirements.tap(PLUGIN_NAME, (_, runtimeRequirements) => {
        runtimeRequirements.add(compiler.rspack.RuntimeGlobals.moduleCache);
      });
    });
  }
}

// @ts-expect-error output module.exports
export = RefreshRspackPlugin;
