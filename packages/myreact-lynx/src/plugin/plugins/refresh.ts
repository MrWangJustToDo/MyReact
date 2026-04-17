/**
 * ReactRefreshRspackPlugin - Rspack plugin for React Refresh (HMR) support.
 *
 * This plugin enables Hot Module Replacement for React components in the
 * Lynx environment by:
 * 1. Providing the refresh utilities via ProvidePlugin
 * 2. Intercepting the hot_module_replacement runtime module to inject
 *    layer-aware refresh handling
 */

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LAYERS } from "../layers.js";

import type { Compilation, Compiler } from "@rspack/core";

type RuntimeModule = Parameters<Compilation["hooks"]["runtimeModule"]["call"]>[0];

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

const require = createRequire(__filename);

const myReactLynxRoot = path.resolve(_dirname, "../../..");

const PLUGIN_NAME = "MyReactRefreshRspackPlugin";

/**
 * The options for {@link ReactRefreshRspackPlugin}.
 *
 * @public
 */
export interface ReactRefreshRspackPluginOptions {
  /**
   * Not ready for public now.
   *
   * @internal
   */
  overlay?: {
    /**
     * The overlay module.
     */
    module: string;
  };
}

/**
 * ReactRefreshRspackPlugin allows using fast refresh in ReactLynx.
 *
 * @example
 * ```js
 * // rspack.config.js
 * import { ReactRefreshRspackPlugin } from '@lynx-js/react-refresh-webpack-plugin'
 * export default {
 *   module: {
 *     rules: [
 *       {
 *         test: /\.[jt]sx?$/,
 *         exclude: [
 *           /node_modules/,
 *           /@lynx-js/,
 *           /react-refresh/,
 *           /compiler-nodiff-runtime3/,
 *           ReactRefreshRspackPlugin.loader,
 *         ],
 *         use: [ReactRefreshRspackPlugin.loader],
 *       },
 *     ],
 *   },
 *   plugins: [new ReactRefreshRspackPlugin()],
 * }
 * ```
 *
 * @public
 */
export class ReactRefreshRspackPlugin {
  /**
   * @param options - The options for react refresh.
   */
  constructor(options: ReactRefreshRspackPluginOptions = {}) {
    this.#options = options;
  }

  #options: ReactRefreshRspackPluginOptions;

  /**
   * The loader for react refresh.
   *
   * @remarks
   * Please note that the runtime of react should be ignored. See the example below:
   *
   * @example
   * ```js
   * // rspack.config.js
   * import { ReactRefreshRspackPlugin } from '@lynx-js/react-refresh-webpack-plugin'
   * import { ReactWebpackPlugin } from '@lynx-js/react-webpack-plugin'
   *
   * export default {
   *   module: {
   *     rules: [
   *       {
   *         issueLayer: ReactWebpackPlugin.LAYERS.BACKGROUND,
   *         test: /\.[jt]sx?$/,
   *         exclude: [
   *           /node_modules/,
   *           /@lynx-js\/react/,
   *           ReactRefreshRspackPlugin.loader,
   *         ],
   *         use: [ReactRefreshRspackPlugin.loader],
   *       },
   *     ],
   *   },
   *   plugins: [new ReactRefreshRspackPlugin()],
   * }
   * ```
   */
  static loader: string = require.resolve(path.resolve(myReactLynxRoot, "client/loader.cjs"));

  /**
   * The entry point of a rspack plugin.
   * @param compiler - the rspack compiler
   */
  apply(compiler: Compiler): void {
    const isDev = process.env["NODE_ENV"] === "development" || compiler.options.mode === "development";

    if (!isDev) {
      return;
    }

    const { ProvidePlugin } = compiler.webpack;

    const provide: Record<string, string> = {
      __myreact_refresh_utils__: require.resolve("@my-react/react-refresh-tools/header"),
    };

    if (this.#options.overlay) {
      provide["__my_react_lynx_errors__"] = this.#options.overlay.module;
    }

    new ProvidePlugin(provide).apply(compiler);

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.runtimeModule.tap(PLUGIN_NAME, (runtimeModule) => {
        if (runtimeModule.name === "hot_module_replacement") {
          this.#appendInterceptRuntimeModule(runtimeModule);
        }
      });
    });
  }

  #appendInterceptRuntimeModule(runtimeModule: RuntimeModule) {
    runtimeModule.source!.source = Buffer.concat([
      Buffer.from(runtimeModule.source!.source as Buffer),

      Buffer.from(
        fs
          .readFileSync(path.resolve(myReactLynxRoot, "client/intercept.cjs"), "utf-8")
          .replaceAll("$MAIN_THREAD_LAYER$", LAYERS.MAIN_THREAD)
          .replaceAll("$BACKGROUND_LAYER$", LAYERS.BACKGROUND)
      ),

      // TODO: merge this with the webpack plugin
      Buffer.from(`
      // noop fns to prevent runtime errors during initialization
      if (typeof globalThis !== "undefined") {
        globalThis.$RefreshReg$ = function () {};
        globalThis.$RefreshSig$ = function () {
          return function(type) {
            return type;
          };
        };
      }`),
    ]);
  }
}
