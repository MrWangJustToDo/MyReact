/**
 * @packageDocumentation
 *
 * A rsbuild / rspeedy plugin that integrates MyReact with Lynx's dual-thread
 * architecture (Background Thread renderer + Main Thread PAPI executor).
 *
 * @example
 * ```ts
 * // lynx.config.ts
 * import { defineConfig } from '@lynx-js/rspeedy'
 * import { pluginMyReactLynx } from '@my-react/react-lynx/plugin'
 *
 * export default defineConfig({
 *   plugins: [pluginMyReactLynx()],
 * })
 * ```
 */

import { applyCSS } from "./css.js";
import { applyEntry } from "./entry.js";
import { LAYERS } from "./layers.js";
import { applyRefresh } from "./refresh.js";

import type { RsbuildPlugin } from "@rsbuild/core";

export { LAYERS };

/**
 * Options for {@link pluginMyReactLynx}.
 * @public
 */
export interface PluginMyReactLynxOptions {
  /**
   * Whether to enable CSS selector support in the Lynx template.
   * When enabled, CSS from imported CSS files will be compiled into
   * the Lynx bundle and applied via class selectors.
   * @defaultValue true
   */
  enableCSSSelector?: boolean;

  /**
   * Whether to enable CSS inheritance in the Lynx engine.
   * When enabled, CSS property values (including CSS custom properties /
   * variables) cascade from parent elements to children.
   * @defaultValue false
   */
  enableCSSInheritance?: boolean;

  /**
   * A list of additional CSS properties to inherit beyond the engine defaults.
   * Only effective when {@link enableCSSInheritance} is `true`.
   * @defaultValue undefined
   */
  customCSSInheritanceList?: string[];

  /**
   * Whether to enable CSS custom properties (variables) in inline styles.
   * When enabled, setting `--*` properties via style bindings will be
   * recognized by the Lynx engine at runtime.
   * @defaultValue false
   */
  enableCSSInlineVariables?: boolean;

  /**
   * Whether to place debug info outside the template bundle.
   * Reduces template size in dev builds.
   * @defaultValue true
   */
  debugInfoOutside?: boolean;

  /**
   * Whether to automatically append `'px'` to numeric style values
   * (e.g. `fontSize: 24` → `'24px'`). Dimensionless properties like
   * `flex`, `opacity`, and `zIndex` are never converted.
   *
   * @defaultValue true
   */
  autoPixelUnit?: boolean;

  /**
   * Whether to enable React compatibility aliases.
   * When enabled, imports from `react`, `react-dom`, etc. will be
   * aliased to `@my-react/react`, `@my-react/react-dom`, etc.
   * This allows existing React code to work with MyReact.
   *
   * @defaultValue true
   */
  enableReactAlias?: boolean;

  /**
   * Whether to enable worklet transform loaders.
   * When enabled, the `@lynx-js/react/transform` SWC plugin is used to
   * transform `'main thread'` directive functions into worklet context objects.
   *
   * NOTE: This is currently disabled by default because the ReactLynx transform
   * also transforms JSX into ReactLynx-specific snapshot code, which is
   * incompatible with MyReact's standard React JSX rendering.
   *
   * @defaultValue false
   */
  enableWorkletTransform?: boolean;

  /**
   * Whether to enable React Refresh (Hot Module Replacement) for components.
   * When enabled, component changes will be hot-reloaded without losing state.
   *
   * This is automatically enabled in development mode unless explicitly disabled.
   *
   * @defaultValue true (in development mode)
   */
  reactRefresh?: boolean;

  reactDevTool?:
    | {
        // default url is: ws://localhost:3002/ws
        // SEE https://github.com/MrWangJustToDo/myreact-devtools websocket mode to known more detail
        // https://github.com/MrWangJustToDo/myreact-devtools/blob/main/chrome/server.mjs
        // https://github.com/MrWangJustToDo/myreact-devtools/blob/main/chrome/src/hooks/useWebSocketDev.ts
        wsUrl?: string;
      }
    | boolean;
}

const PLUGIN_NAME = "lynx:myreact";

/**
 * React → MyReact alias mappings.
 * These allow existing React code to work with MyReact without modification.
 *
 * Note: We alias `react` to `@my-react/react-lynx` so users get Lynx-specific
 * APIs (useInitData, etc.) when importing from 'react'. However, we do NOT
 * alias `@my-react/react` to avoid circular imports since @my-react/react-lynx
 * internally imports from @my-react/react.
 *
 * Note: We use `$` suffix for exact matching to avoid accidentally aliasing
 * other packages like `@lynx-js/react`. The `$` means "end of string" in
 * rspack/webpack alias matching.
 */
const REACT_ALIASES: Record<string, string> = {
  react$: "@my-react/react",
  "react-dom$": "@my-react/react-dom",
  "react-dom/server$": "@my-react/react-dom/server",
  "react-dom/client$": "@my-react/react-dom/client",
  "react/jsx-runtime$": "@my-react/react-lynx/jsx-runtime",
  "react/jsx-dev-runtime$": "@my-react/react-lynx/jsx-dev-runtime",
};

/**
 * Create rsbuild / rspeedy plugin for MyReact-Lynx dual-thread rendering.
 *
 * @public
 */
export function pluginMyReactLynx(options: PluginMyReactLynxOptions = {}): RsbuildPlugin {
  const {
    enableCSSSelector = true,
    enableCSSInheritance = false,
    customCSSInheritanceList,
    enableCSSInlineVariables = false,
    debugInfoOutside = true,
    autoPixelUnit = true,
    enableReactAlias = true,
    enableWorkletTransform = false,
    reactRefresh = true,
    reactDevTool = false,
  } = options;

  return {
    name: PLUGIN_NAME,
    // Must run after lynx core plugins
    pre: ["lynx:rsbuild:plugin-api", "lynx:config"],

    setup(api) {
      api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
        // By default, Rsbuild does not compile JavaScript files under
        // node_modules via SWC. Many npm packages ship ES2021+ syntax
        // which the Lynx JS engine does not support. Compile all JS files.
        const userConfig = api.getRsbuildConfig("original");
        if (typeof userConfig.source?.include === "undefined") {
          config = mergeRsbuildConfig(config, {
            source: {
              include: [/\.(?:js|mjs|cjs)$/],
            },
          });
        }

        // Check if React Refresh should be enabled
        const isDev = process.env.NODE_ENV !== "production";
        const enableRefresh = isDev && reactRefresh;

        return mergeRsbuildConfig(config, {
          source: {
            define: {
              __DEV__: "process.env.NODE_ENV !== 'production'",
              __HMR__: enableRefresh,
              __DEVTOOL__: typeof reactDevTool === "boolean" ? reactDevTool : JSON.stringify(reactDevTool),
              __MY_REACT_LYNX_AUTO_PIXEL_UNIT__: JSON.stringify(autoPixelUnit),
              // Lynx dual-thread macros (default values, overridden per layer in entry.ts)
              __LEPUS__: "false",
              __BACKGROUND__: "true",
              __MAIN_THREAD__: "false",
            },
          },
          tools: {
            rspack: {
              output: {
                iife: false,
              },
            },
            swc: {
              jsc: {
                // The Lynx JS engine only supports up to ES2019 syntax.
                target: "es2019",
                transform: {
                  react: {
                    // Use automatic JSX runtime (jsx/jsxs from react/jsx-runtime)
                    runtime: "automatic",
                    // Import from @my-react/react-lynx instead of react
                    importSource: "@my-react/react-lynx",

                    // enable react refresh transform, we need provider global function
                    refresh: enableRefresh,

                    development: isDev,
                  },
                },
              },
            },
          },
        });
      });

      api.modifyBundlerChain((chain) => {
        // Resolve alias for @my-react/react-lynx internal paths
        // This ensures the runtime files resolve correctly in pnpm workspaces
        chain.resolve.alias.set("@my-react/react-lynx", "@my-react/react-lynx");

        // Apply React → MyReact aliases if enabled
        // This allows existing React code to work with MyReact
        if (enableReactAlias) {
          for (const [from, to] of Object.entries(REACT_ALIASES)) {
            chain.resolve.alias.set(from, to);
          }
        }
      });

      applyCSS(api, {
        enableCSSSelector,
        enableCSSInvalidation: enableCSSSelector,
      });

      applyEntry(api, {
        enableCSSSelector,
        enableCSSInheritance,
        customCSSInheritanceList,
        enableCSSInlineVariables,
        debugInfoOutside,
        enableWorkletTransform,
        reactRefresh,
      });

      if (reactRefresh) {
        applyRefresh(api);
      }
    },
  };
}
