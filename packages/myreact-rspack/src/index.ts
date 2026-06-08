import { normalizeOptions } from "./options.js";
import { getRefreshRuntimeDirPath, getRefreshRuntimePaths, reactRefreshEntryPath, reactRefreshPath, refreshUtilsPath } from "./paths.js";

import type { NormalizedPluginOptions, PluginOptions } from "./options.js";
import type { Compiler } from "@rspack/core";

export type { PluginOptions };

function addEntry(entry: string, compiler: Compiler) {
  new compiler.rspack.EntryPlugin(compiler.context, entry, {
    name: undefined,
  }).apply(compiler);
}

const PLUGIN_NAME = "_ReactRefreshRspackPlugin";

class ReactRefreshRspackPlugin {
  options: NormalizedPluginOptions;

  constructor(options: PluginOptions = {}) {
    this.options = normalizeOptions(options);
  }

  apply(compiler: Compiler) {
    if (
      (compiler.options.mode !== "development" ||
        // We also check for production process.env.NODE_ENV,
        // in case it was set and mode is non-development (e.g. 'none')
        (process.env.NODE_ENV && process.env.NODE_ENV === "production")) &&
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

    if (this.options.injectEntry) {
      addEntry(reactRefreshEntryPath, compiler);
    }

    new compiler.rspack.ProvidePlugin({
      $ReactRefreshRuntime$: reactRefreshPath,
    }).apply(compiler);

    if (this.options.injectLoader) {
      compiler.options.module.rules.unshift({
        test: this.options.test,
        include: this.options.include!,
        exclude: {
          or: [this.options.exclude!, [...getRefreshRuntimePaths()]].filter(Boolean),
        },
        resourceQuery: this.options.resourceQuery,
        dependency: {
          // Assets loaded via `new URL("static/sdk.js", import.meta.url)` are asset modules
          // React Refresh should not be injected for asset modules as they are static resources
          not: ["url"],
        },
        use: this.options.reactRefreshLoader,
      });
    }

    const definedModules: Record<string, string | boolean> = {
      // For Multiple Instance Mode
      __react_refresh_library__: JSON.stringify(
        compiler.rspack.Template.toIdentifier(this.options.library || compiler.options.output.uniqueName || compiler.options.output.library)
      ),
      __reload_on_runtime_errors__: this.options.reloadOnRuntimeErrors,
    };
    const providedModules: Record<string, string> = {
      __react_refresh_utils__: refreshUtilsPath,
    };
    new compiler.rspack.DefinePlugin(definedModules).apply(compiler);
    new compiler.rspack.ProvidePlugin(providedModules).apply(compiler);

    // const refreshPath = path.dirname(require.resolve("@my-react/react-refresh"));
    compiler.options.resolve.alias = {
      "react-refresh": getRefreshRuntimeDirPath(),
      "@my-react/react-refresh": getRefreshRuntimeDirPath(),
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

export { ReactRefreshRspackPlugin };
