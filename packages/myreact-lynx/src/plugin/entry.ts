/* eslint-disable max-lines */
/**
 * Dual-thread entry splitting for MyReact Lynx.
 *
 * Sets up the webpack configuration for Lynx's dual-thread architecture:
 * - Background Thread: runs the MyReact reconciler and user app
 * - Main Thread (LEPUS): executes PAPI operations and worklets
 *
 * ## Lazy Loading (React.lazy / Dynamic Import) - Known Issues & Fixes
 *
 * ### Issue 1: Native Lynx requires RuntimeWrapperWebpackPlugin for all JS files
 *
 * **Error**: `ReferenceError: Can not find variable: exports`
 *
 * **Why it happens**:
 * - Webpack generates JS files with CommonJS format using `exports`
 * - On native Lynx, `exports` is not a global variable
 * - The `RuntimeWrapperWebpackPlugin` provides `exports` via `tt.define()` wrapper
 *
 * **Affected files**:
 * - Entry files: `main/background.js`
 * - Async chunks: `_chunk_name.js`
 * - HMR update files: `main.[hash].hot-update.js`
 *
 * **Fix**: Wrap ALL `.js` files except `main-thread.js` (same as ReactLynx)
 * ```ts
 * test: /^(?!.*main-thread(?:\.[A-Fa-f0-9]*)?\.js$).*\.js$/
 * ```
 *
 * **How native Lynx handles wrapped chunks**:
 * - The wrapper returns `{ init: fn }` when `bundleSupportLoadScript` is true
 * - Native Lynx runtime automatically calls `init(lynxCoreInject)`
 * - This returns the correct `{ ids, modules }` format for chunk loading
 *
 * **Web simulator difference**:
 * - Web simulator may not handle `{ init }` wrapper format the same way
 * - This can cause chunk loading failures on web but work on native Lynx
 * - For web compatibility, ensure proper chunk loading plugin configuration
 *
 * ### Issue 2: CSS HMR causes null pointer in React Refresh interceptor
 *
 * **Error**: `TypeError: originalFactory is undefined` in `intercept.cjs`
 *
 * **Why it happened**:
 * - `intercept.cjs` hooks into `__webpack_require__.i` to wrap module factories
 * - It wraps factories with React Refresh registration logic
 * - CSS modules loaded via `css-extract-webpack-plugin` HMR don't have factories
 * - When lazy-loaded CSS triggers HMR, `options.factory` is `undefined`
 * - Code tried to call `originalFactory.call(...)` on undefined
 *
 * **Fix**: Check if factory exists before wrapping (in `client/intercept.cjs`)
 * ```js
 * var originalFactory = options.factory;
 * if (typeof originalFactory !== "function") {
 *   return; // Skip CSS modules and other non-JS modules
 * }
 * ```
 *
 * **Why this fix works**:
 * - CSS modules don't need React Refresh wrapping (they're not React components)
 * - Skipping undefined factories lets CSS HMR work normally
 * - JS modules still get proper React Refresh registration
 *
 * ### Issue 3: `__JS__ is not defined` when using loadLazyBundle
 *
 * **Error**: `ReferenceError: __JS__ is not defined`
 *
 * **Why it happened**:
 * - `loadLazyBundle` from `@lynx-js/react/internal` uses compile-time constant `__JS__`
 * - `__JS__` is `true` on Background Thread, `false` on Main Thread (LEPUS)
 * - The `@lynx-js/react/internal` module is pre-built, so `DefinePlugin` can't replace it
 * - When user code imports `loadLazyBundle`, it fails at runtime
 *
 * **Fix**: Created shim module and alias (in `rsbuild.ts` and `shims/lynx-react-internal.ts`)
 * ```ts
 * // Alias redirects imports to our shim
 * chain.resolve.alias.set("@lynx-js/react/internal$", "@my-react/react-lynx/shims/lynx-react-internal");
 *
 * // Shim re-exports everything but overrides loadLazyBundle
 * export * from "@lynx-js/react/internal";
 * export { loadLazyBundle } from "../runtime/lazy-bundle.js";
 * ```
 *
 * **Why this fix works**:
 * - Our `loadLazyBundle` implementation uses `__LEPUS__` which IS defined in our build
 * - The shim intercepts imports and provides MyReact-compatible implementations
 * - Original module's other exports still work via re-export
 *
 * ### Issue 4: ReactLynx transform converts import() to __dynamicImport
 *
 * **Error**: Various chunk loading failures, malformed URLs like `/async/./LazyCom.js-.xxx.bundle`
 *
 * **Why it happened**:
 * - ReactLynx's SWC transform has `dynamicImport` option (enabled by default)
 * - It converts `import('./Component')` to `__dynamicImport('./Component', {type: 'component'})`
 * - `__dynamicImport` uses ReactLynx's lazy bundle system (not standard webpack chunks)
 * - This is designed for ReactLynx's snapshot system, not standard React.lazy()
 *
 * **Fix**: Disable dynamicImport in worklet loaders (in `worklet-loader.ts` and `worklet-loader-mt.ts`)
 * ```ts
 * const result = transformReactLynxSync(source, {
 *   dynamicImport: false,  // Don't transform import() calls
 *   // ... other options
 * });
 * ```
 *
 * **Why this fix works**:
 * - Standard `import()` creates webpack async chunks (correct format)
 * - `ChunkLoadingWebpackPlugin` handles these chunks properly
 * - React.lazy() works with standard dynamic imports
 *
 * ### Issue 5: JSX namespace syntax not supported
 *
 * **Error**: `JSX Namespace is disabled by default because react does not support it yet`
 *
 * **Why it happened**:
 * - Lynx uses JSX namespace syntax: `main-thread:bindmouseclick={handler}`
 * - SWC's React JSX transform rejects namespace syntax by default
 * - This is a Lynx-specific extension for main-thread event binding
 *
 * **Fix**: Enable namespace support in SWC config (in `rsbuild.ts`)
 * ```ts
 * tools: {
 *   swc: {
 *     jsc: {
 *       transform: {
 *         react: {
 *           throwIfNamespace: false,  // Allow main-thread:bindtap etc.
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ### Issue 6: Worklet HMR causes stale registrations
 *
 * **Error**: `Cannot read properties of undefined (reading 'bind')` after HMR
 *
 * **Why it happened**:
 * - Worklet functions have content-hashed `_wkltId` (e.g., `_wkltId: "abc123"`)
 * - Main Thread has `registerWorkletInternal` map: `{ "abc123": actualFunction }`
 * - HMR updates Background Thread code, changing worklet content → new hash
 * - Main Thread's map still has old hash, new hash lookup returns `undefined`
 * - Calling `.bind()` on undefined throws
 *
 * **Fix**: Added timeout and warning in `cross-thread.ts`
 * ```ts
 * // In dev mode, use timeout to detect stale worklets
 * if (__DEV__) {
 *   onFunctionCallWithTimeout(resolve, reject, DEV_WORKLET_TIMEOUT);
 *   // Shows warning: "Try refreshing the page to re-register all worklets"
 * }
 * ```
 *
 * **Why this fix works**:
 * - Can't truly fix HMR for worklets (architectural limitation, same in ReactLynx)
 * - Timeout provides clear error message instead of cryptic `.bind()` error
 * - Warning tells developer to refresh page
 *
 * ### Issue 7: Chunk loading not configured for Lynx environment
 *
 * **Error**: Async chunks fail to load, various webpack runtime errors
 *
 * **Why it happened**:
 * - Lynx uses custom chunk loading via `lynx.requireModuleAsync`
 * - Default webpack chunk loading (jsonp/import-scripts) doesn't work in Lynx
 * - Need `ChunkLoadingWebpackPlugin` to enable `chunkLoading: 'lynx'`
 *
 * **Fix**: Added chunk loading plugin with environment awareness (in `rsbuild.ts`)
 * ```ts
 * const isLynxEnv = environment.name === "lynx" || environment.name.startsWith("lynx-");
 * if (isLynxEnv) {
 *   chain.plugin("lynx:chunk-loading").use(ChunkLoadingWebpackPlugin);
 *   chain.output.chunkLoading("lynx").chunkFormat("commonjs");
 * }
 * ```
 *
 * **Why this fix works**:
 * - `ChunkLoadingWebpackPlugin` adds Lynx-specific chunk loading runtime
 * - `chunkLoading: 'lynx'` tells webpack to use Lynx's loading mechanism
 * - `chunkFormat: 'commonjs'` ensures chunks export `{ ids, modules, runtime }`
 * - Environment check ensures web simulator uses different (default) loading
 *
 * ### Issue 8: Lazy loading automatically generates bundles (no webpackChunkName needed)
 *
 * **Previous issue**: CSS in lazy-loaded components didn't apply without `webpackChunkName`
 *
 * **Why it happened**:
 * - `LynxTemplatePlugin` only generates `.bundle` files for named async chunks
 * - Without `webpackChunkName`, chunks had no name → no bundle → no CSS
 *
 * **Fix**: `auto-chunk-name-loader` automatically adds `webpackChunkName` to imports.
 *
 * Now this just works:
 * ```ts
 * const LazyComponent = lazy(() => import("./LazyCom"));
 * // No manual webpackChunkName needed!
 * // - Generates async/LazyCom.[hash].bundle with CSS included
 * // - Works on both native Lynx and web simulator
 * ```
 *
 * **How it works**:
 * 1. `auto-chunk-name-loader` transforms dynamic imports to include chunk names
 * 2. Webpack sees the chunk name during parsing (before compilation)
 * 3. `LynxTemplatePlugin` generates `async/[name].[hash].bundle`
 * 4. `MyReactMarkMainThreadPlugin.asyncChunkName` normalizes layer suffixes
 *
 * **Note**: CSS HMR doesn't work for lazy components (requires page refresh).
 *
 * ### Issue 9: `lynx.loadLazyBundle is not a function`
 *
 * **Error**: `TypeError: lynx.loadLazyBundle is not a function`
 *
 * **Why it happened**:
 * - `lynx.loadLazyBundle` is NOT a native Lynx API
 * - It's provided by ReactLynx's runtime (`@lynx-js/react/runtime`)
 * - The chunk loading code calls `lynx.loadLazyBundle()` to load async bundles
 * - Without registration, `lynx.loadLazyBundle` is undefined
 *
 * **Fix**: Register `loadLazyBundle` on `lynx` in entry-background.ts
 * ```ts
 * import { loadLazyBundle } from "./lazy-bundle.js";
 *
 * if (typeof lynx !== "undefined") {
 *   lynx.loadLazyBundle = loadLazyBundle;
 * }
 * ```
 *
 * **Why this fix works**:
 * - Entry bootstrap runs before any user code or chunk loading
 * - Registering early ensures `lynx.loadLazyBundle` exists when needed
 * - Our implementation uses Lynx's `QueryComponent` API to load bundles
 *
 * ### Issue 10: Async template missing `lepusCode` (empty root URL)
 *
 * **Error**: `Error: [lynx-web] Missing root URL for component: http://.../async/LazyCom.xxx.bundle`
 *
 * **Why it happened**:
 * - `LynxTemplatePlugin` generates async bundles with both `manifest` (BG) and `lepusCode` (MT)
 * - The `lepusCode.root` is set from `assetsInfoByGroups.mainThread[0]`
 * - This requires main-thread JS files for the async chunk
 * - Our `worklet-loader-mt` was stripping dynamic imports, so no MT async chunks were created
 * - Without MT async files, the async template's `lepusCode` was empty: `{}`
 *
 * **Fix (multi-part)**:
 *
 * 1. **Preserve dynamic imports in worklet-loader-mt.ts**:
 *    ```ts
 *    // New function in worklet-utils.ts
 *    export function extractDynamicImports(source: string): string {
 *      // Match import('./path') and preserve them
 *    }
 *
 *    // In worklet-loader-mt.ts
 *    const dynamicImports = extractDynamicImports(source);
 *    const parts = [..., dynamicImports, ...].filter(Boolean);
 *    return parts.join("\n");
 *    ```
 *
 * 2. **Mark async MT chunks with `lynx:main-thread` info in mark-main-thread.ts**:
 *    ```ts
 *    for (const chunkGroup of compilation.chunkGroups) {
 *      if (chunkGroup.isInitial()) continue;
 *      const isMainThreadOrigin = chunkGroup.origins.every(
 *        origin => origin.module?.layer === LAYERS.MAIN_THREAD
 *      );
 *      if (!isMainThreadOrigin) continue;
 *      // Mark files as lynx:main-thread
 *    }
 *    ```
 *
 * 3. **Wrap async MT chunks with `globDynamicComponentEntry` function**:
 *    ```ts
 *    compilation.updateAsset(file, old => new ConcatSource(
 *      "(function (globDynamicComponentEntry) {\n",
 *      "  const module = { exports: {} };\n",
 *      "  const exports = module.exports;\n",
 *      old,
 *      "\n  ;return module.exports;\n})"
 *    ));
 *    ```
 *
 * 4. **Provide minimal stub for empty lepusCode in mark-main-thread.ts**:
 *    ```ts
 *    // In beforeEncode hook for async bundles
 *    if (encodeData.sourceContent?.appType === "DynamicComponent" && !encodeData.lepusCode?.root) {
 *      const stubCode = `(function (globDynamicComponentEntry) {
 *        const module = { exports: {} };
 *        const exports = module.exports;
 *        ;return module.exports;
 *      })`;
 *      encodeData.lepusCode.root = { name: "__stub__.js", source: new RawSource(stubCode) };
 *    }
 *    ```
 *
 * **Why this fix works**:
 * - Preserving dynamic imports in MT loader allows webpack to create MT async chunks
 * - However, for lazy components WITHOUT worklet code, the MT async content is empty
 * - The web simulator still expects `lepusCode.root` to exist in async bundles
 * - We provide a minimal stub that satisfies this requirement
 *
 * ### Issue 11: `lynx.loadLazyBundle is not a function` on Main Thread
 *
 * **Error**: `Uncaught TypeError: lynx.loadLazyBundle is not a function`
 *            at `(myreact:main-thread)/./src/index.tsx`
 *
 * **Why it happened**:
 * - The chunk loading runtime calls `lynx.loadLazyBundle()` to load async bundles
 * - We only registered `loadLazyBundle` on the background thread (`entry-background.ts`)
 * - The main thread runs BEFORE the background thread bootstrap
 * - When MT dynamic import resolves, `lynx.loadLazyBundle` is undefined
 *
 * **Fix**: Register `loadLazyBundle` on main thread too (`entry-main.ts`)
 * ```ts
 * if (typeof lynx !== "undefined") {
 *   lynx.loadLazyBundle = function loadLazyBundle<T>(source: string): Promise<T> {
 *     const query = __QueryComponent(source);
 *     let result: T;
 *     try {
 *       result = query.evalResult as T;
 *     } catch (_e) {
 *       return new Promise(() => {});
 *     }
 *     return Promise.resolve(result);
 *   };
 * }
 * ```
 *
 * **Why this fix works**:
 * - Main thread entry runs first in the template
 * - `loadLazyBundle` is available before any chunk loading code runs
 * - Uses `__QueryComponent` for synchronous LEPUS loading
 * - The stub exports an empty object, which is correct for components without MT code
 *
 * ### ReactLynx Comparison
 *
 * ReactLynx uses the same `RuntimeWrapperWebpackPlugin` regex but has additional
 * handling in `@lynx-js/react-webpack-plugin` that we don't use:
 * - `experimental_isLazyBundle` option for special lazy bundle handling
 * - Custom async chunk wrapper injection in `processAssets` stage
 * - Their snapshot system expects different chunk format than standard webpack
 *
 * For MyReact, we use standard React rendering (not snapshots), so we need
 * plain CommonJS async chunks that work with `ChunkLoadingWebpackPlugin`.
 */

import { RuntimeWrapperWebpackPlugin } from "@lynx-js/runtime-wrapper-webpack-plugin";
import { LynxEncodePlugin, LynxTemplatePlugin, WebEncodePlugin } from "@lynx-js/template-webpack-plugin";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LAYERS } from "./layers.js";
import { MyReactCSSConfigPlugin, MyReactMarkMainThreadPlugin, PLUGIN_MARK_MAIN_THREAD } from "./plugins";

import type { RsbuildPluginAPI } from "@rsbuild/core";

const PLUGIN_TEMPLATE = "lynx:myreact-template";
const PLUGIN_RUNTIME_WRAPPER = "lynx:myreact-runtime-wrapper";
const PLUGIN_ENCODE = "lynx:myreact-encode";
const PLUGIN_WEB_ENCODE = "lynx:myreact-web-encode";
const PLUGIN_CSS_CONFIG = "lynx:myreact-css-config";

const DEFAULT_INTERMEDIATE = ".rspeedy";

const _dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const myReactLynxRoot = path.resolve(_dirname, "../..");

export interface ApplyEntryOptions {
  enableCSSSelector?: boolean;
  enableCSSInheritance?: boolean;
  customCSSInheritanceList?: string[];
  enableCSSInlineVariables?: boolean;
  debugInfoOutside?: boolean;
  /**
   * Whether to enable React Refresh (Hot Module Replacement) for components.
   * When enabled, component changes will be hot-reloaded without losing state.
   *
   * @defaultValue true
   */
  reactRefresh?: boolean;
}

export function applyEntry(api: RsbuildPluginAPI, opts: ApplyEntryOptions = {}): void {
  // Expose LynxTemplatePlugin hooks so other plugins can interact with the Lynx template pipeline.
  const sLynxTemplatePlugin = Symbol.for("LynxTemplatePlugin");
  api.expose(sLynxTemplatePlugin, {
    LynxTemplatePlugin: {
      getLynxTemplatePluginHooks: LynxTemplatePlugin.getLynxTemplatePluginHooks.bind(LynxTemplatePlugin),
    },
  });

  // Read Lynx engine config from pluginLynxConfig if present.
  const sLynxConfig = Symbol.for("lynx.config");
  const exposedConfig = api.useExposed(sLynxConfig) as { config: Record<string, unknown> } | undefined;
  if (exposedConfig) {
    const configKeys: Array<keyof ApplyEntryOptions> = ["enableCSSSelector", "enableCSSInheritance", "customCSSInheritanceList", "enableCSSInlineVariables"];
    for (const key of configKeys) {
      if (Object.hasOwn(exposedConfig.config, key)) {
        (opts as Record<string, unknown>)[key] = exposedConfig.config[key];
      }
    }
  }

  // Default to all-in-one chunk splitting to avoid async chunks that break
  // Lynx's single-file bundle requirement.
  api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
    const userConfig = api.getRsbuildConfig("original");
    if (!userConfig.performance?.chunkSplit?.strategy) {
      return mergeRsbuildConfig(config, {
        performance: { chunkSplit: { strategy: "all-in-one" } },
      });
    }
    return config;
  });

  // Exclude main-thread chunks from chunk splitting so each remains self-contained.
  // Also ensure CSS HMR runtime is in the initial chunk for lazy-loaded CSS.
  api.modifyRspackConfig((rspackConfig) => {
    if (!rspackConfig.optimization) return rspackConfig;

    if (rspackConfig.optimization.splitChunks === false) {
      rspackConfig.optimization.splitChunks = {};
    }

    if (rspackConfig.optimization.splitChunks) {
      const prev = rspackConfig.optimization.splitChunks.chunks;
      // biome-ignore lint/suspicious/noExplicitAny: rspack Chunk type not importable
      rspackConfig.optimization.splitChunks.chunks = (chunk: any) => {
        if (chunk.name?.includes("__main-thread")) return false;
        if (typeof prev === "function") return prev(chunk);
        if (prev === "all") return true;
        if (prev === "initial") return true;
        return false;
      };
    }

    return rspackConfig;
  });

  // Apply worklet loaders
  applyWorkletLoaders(api);

  api.modifyBundlerChain((chain, { environment, isDev, isProd }) => {
    const isRspeedy = api.context.callerName === "rspeedy";
    if (!isRspeedy) return;

    const isLynx = environment.name === "lynx" || environment.name.startsWith("lynx-");
    const isWeb = environment.name === "web" || environment.name.startsWith("web-");

    // HMR / Live Reload flags
    // Note: HMR is disabled for web because Lynx web preview doesn't support CSS HMR.
    // CSS changes in web preview require a page reload.
    const { hmr, liveReload } = environment.config.dev ?? {};
    const enabledHMR = isDev && !isWeb && hmr !== false;
    const enabledLiveReload = isDev && !isWeb && liveReload !== false;

    const entries = chain.entryPoints.entries() ?? {};

    chain.entryPoints.clear();

    // Collect all main-thread filenames to mark with lynx:main-thread
    const mainThreadFilenames: string[] = [];

    // Resolve worklet-runtime from @lynx-js/react (reuse existing impl).
    const workletRuntimePath = require.resolve("@lynx-js/react/worklet-runtime");

    // Resolve entry paths relative to package dist
    const entryBackgroundPath = path.resolve(myReactLynxRoot, "dist/runtime/entry-background.js");
    const entryMainThreadPath = path.resolve(myReactLynxRoot, "dist/main-thread/entry-main.js");

    const devToolRuntime = path.resolve(myReactLynxRoot, "client/dev-runtime.js");

    for (const [entryName, entryPoint] of Object.entries(entries)) {
      // Collect user imports from the original entry
      const imports: string[] = [];
      for (const val of entryPoint.values()) {
        if (typeof val === "string") {
          imports.push(val);
        } else if (typeof val === "object" && val !== null && "import" in val) {
          const imp = (val as { import?: string | string[] }).import;
          if (Array.isArray(imp)) imports.push(...imp);
          else if (imp) imports.push(imp);
        }
      }

      // Filenames
      const intermediate = isLynx ? DEFAULT_INTERMEDIATE : "";
      const mainThreadEntry = `${entryName}__main-thread`;
      const mainThreadName = path.posix.join(intermediate, `${entryName}/main-thread.js`);
      const backgroundName = path.posix.join(intermediate, `${entryName}/background${isProd ? ".[contenthash:8]" : ""}.js`);

      if (isLynx || isWeb) {
        mainThreadFilenames.push(mainThreadName);
      }

      // Main Thread bundle – PAPI bootstrap + worklet runtime + user code
      // User code is included for 'main thread' directive extraction.
      const mainThreadImports = [entryMainThreadPath, workletRuntimePath, ...imports];

      chain
        .entry(mainThreadEntry)
        .add({
          layer: LAYERS.MAIN_THREAD,
          import: mainThreadImports,
          filename: mainThreadName,
        })
        .when(enabledHMR, (entry) => {
          entry.prepend({
            layer: LAYERS.MAIN_THREAD,
            import: require.resolve("@lynx-js/css-extract-webpack-plugin/runtime/hotModuleReplacement.lepus.cjs"),
          });
        })
        .end();

      // Background bundle – MyReact runtime + user app
      chain
        .entry(entryName)
        .add({
          layer: LAYERS.BACKGROUND,
          import: imports,
          filename: backgroundName,
        })
        .prepend({
          layer: LAYERS.BACKGROUND,
          import: entryBackgroundPath,
        })
        .when(isDev, (entry) => {
          entry.prepend({
            layer: LAYERS.BACKGROUND,
            import: devToolRuntime,
          });
        })
        .when(enabledHMR, (entry) => {
          entry.prepend({
            layer: LAYERS.BACKGROUND,
            import: "@rspack/core/hot/dev-server",
          });
        })
        .when(enabledHMR || enabledLiveReload, (entry) => {
          entry.prepend({
            layer: LAYERS.BACKGROUND,
            import: "@lynx-js/webpack-dev-transport/client",
          });
        })
        .end();

      // LynxTemplatePlugin – packages both bundles into .lynx.bundle
      if (isLynx || isWeb) {
        const templateFilename =
          (typeof environment.config.output.filename === "object"
            ? (environment.config.output.filename as { bundle?: string }).bundle
            : environment.config.output.filename) ?? "[name].[platform].bundle";

        chain
          .plugin(`${PLUGIN_TEMPLATE}-${entryName}`)
          .use(LynxTemplatePlugin, [
            {
              ...LynxTemplatePlugin.defaultOptions,
              dsl: "react_nodiff",
              chunks: [mainThreadEntry, entryName],
              filename: templateFilename.replaceAll("[name]", entryName).replaceAll("[platform]", environment.name),
              intermediate: path.posix.join(intermediate, entryName),
              debugInfoOutside: opts.debugInfoOutside ?? true,
              enableCSSSelector: opts.enableCSSSelector ?? true,
              enableCSSInvalidation: opts.enableCSSSelector ?? true,
              enableCSSInheritance: opts.enableCSSInheritance ?? false,
              customCSSInheritanceList: opts.customCSSInheritanceList,
              enableRemoveCSSScope: true,
              enableNewGesture: true,
              removeDescendantSelectorScope: true,
              cssPlugins: [],
            },
          ])
          .end();
      }
    }

    // MyReactMarkMainThreadPlugin – mark MT assets and handle async chunk naming
    if ((isLynx || isWeb) && mainThreadFilenames.length > 0) {
      chain.plugin(PLUGIN_MARK_MAIN_THREAD).use(MyReactMarkMainThreadPlugin, [mainThreadFilenames]).end();
    }

    // MyReactCSSConfigPlugin – inject engine compiler options
    if (isLynx) {
      const cssConfigOptions: Record<string, unknown> = {};
      if (opts.enableCSSInlineVariables) {
        cssConfigOptions["enableCSSInlineVariables"] = true;
      }
      if (Object.keys(cssConfigOptions).length > 0) {
        chain.plugin(PLUGIN_CSS_CONFIG).use(MyReactCSSConfigPlugin, [cssConfigOptions]).end();
      }
    }

    // RuntimeWrapperWebpackPlugin – wrap ALL .js files except main-thread
    //
    // ### Issue 12: Native Lynx "exports is not defined" for JS files
    //
    // **Error**: `ReferenceError: Can not find variable: exports`
    //
    // **Why it happens**:
    // - Webpack generates JS files with CommonJS format:
    //   ```js
    //   exports.ids = ["chunk_id"];
    //   exports.modules = { ... };
    //   ```
    // - On native Lynx, `exports` is not a global variable
    // - The `RuntimeWrapperWebpackPlugin` wrapper provides `exports` via `tt.define()`
    //
    // **Affected files**:
    // - Entry files: `main/background.js`
    // - HMR update files: `main.[hash].hot-update.js`
    // - Async chunks: `_chunk_name.js`
    //
    // **Fix**: Use the same pattern as ReactLynx - wrap ALL `.js` except `main-thread.js`
    //
    // **How native Lynx handles wrapped chunks**:
    // - The wrapper returns `{ init: fn }` when `bundleSupportLoadScript` is true
    // - Native Lynx runtime calls `init(lynxCoreInject)` to get actual exports
    // - This returns the correct `{ ids, modules }` format for chunk loading
    //
    // **Note on Issue 1 (async chunk loading failure)**:
    // - Issue 1 documented failures when wrapping async chunks on web simulator
    // - This was because web simulator doesn't handle `{ init }` wrapper format
    // - On native Lynx, the runtime properly handles this format
    // - We now use ReactLynx's pattern for native compatibility
    //
    if (isLynx) {
      chain
        .plugin(PLUGIN_RUNTIME_WRAPPER)
        .use(RuntimeWrapperWebpackPlugin, [
          {
            // Wrap all .js files EXCEPT main-thread.js (same as ReactLynx)
            // - Matches: background.js, async chunks, HMR updates
            // - Excludes: main-thread.js, main-thread.[hash].js
            test: /^(?!.*main-thread(?:\.[A-Fa-f0-9]*)?\.js$).*\.js$/,
          },
        ])
        .end()
        .plugin(PLUGIN_ENCODE)
        .use(LynxEncodePlugin, [{}])
        .end();
    }

    if (isWeb) {
      chain.plugin(PLUGIN_WEB_ENCODE).use(WebEncodePlugin, []).end();
    }

    // Disable IIFE wrapping – Lynx handles module scoping itself
    chain.output.set("iife", false);
  });
}

/**
 * Apply worklet transform loaders for BG and MT layers.
 *
 * These loaders use @lynx-js/react/transform SWC plugin to transform
 * 'main thread' directive functions into worklet context objects.
 */
function applyWorkletLoaders(api: RsbuildPluginAPI): void {
  // Worklet loader (BG layer): runs SWC JS-target transform on BG-layer files
  // to replace 'main thread' functions with context objects.
  api.modifyBundlerChain((chain, { environment }) => {
    const isLynx = environment.name === "lynx" || environment.name.startsWith("lynx-");
    const isWeb = environment.name === "web" || environment.name.startsWith("web-");
    if (!isLynx && !isWeb) return;

    // Resolve bootstrap package directories to exclude from BG loaders.
    const mainThreadPkgDir = path.resolve(myReactLynxRoot, "dist/main-thread");
    const runtimePkgDir = path.resolve(myReactLynxRoot, "dist/runtime");
    const sharedPkgDir = path.resolve(myReactLynxRoot, "dist/shared");

    // Auto chunk name loader: adds webpackChunkName to dynamic imports
    // This ensures all lazy imports generate .bundle files with CSS included.
    // Must run BEFORE other loaders (added last, runs first due to loader order)
    chain.module
      .rule("myreact:auto-chunk-name")
      .issuerLayer(LAYERS.BACKGROUND)
      .test(/\.(?:[cm]?[jt]sx?)$/)
      .exclude.add(/node_modules/)
      .add(mainThreadPkgDir)
      .add(runtimePkgDir)
      .add(sharedPkgDir)
      .end()
      .use("auto-chunk-name-loader")
      .loader(path.resolve(_dirname, "./loaders/auto-chunk-name-loader"))
      .end();

    chain.module
      .rule("myreact:worklet")
      .issuerLayer(LAYERS.BACKGROUND)
      .test(/\.(?:[cm]?[jt]sx?)$/)
      .exclude.add(/node_modules/)
      .add(mainThreadPkgDir)
      .add(runtimePkgDir)
      .add(sharedPkgDir)
      .end()
      .use("worklet-loader")
      .loader(path.resolve(_dirname, "./loaders/worklet-loader"))
      .end();

    // Scope injection loader: injects defaultProps.__lynxScope on exported components
    // This enables CSS scoping for lazy-loaded components via getChildHostContext
    chain.module
      .rule("myreact:scope-inject")
      .issuerLayer(LAYERS.BACKGROUND)
      .test(/\.(?:[cm]?[jt]sx?)$/)
      .exclude.add(/node_modules/)
      .add(mainThreadPkgDir)
      .add(runtimePkgDir)
      .add(sharedPkgDir)
      .end()
      .use("scope-inject-loader")
      .loader(path.resolve(_dirname, "./loaders/scope-inject-loader"))
      .end();
  });

  // MT-layer loaders: process user code to extract LEPUS worklet registrations.
  api.modifyBundlerChain((chain, { environment }) => {
    const isLynx = environment.name === "lynx" || environment.name.startsWith("lynx-");
    const isWeb = environment.name === "web" || environment.name.startsWith("web-");
    if (!isLynx && !isWeb) return;

    // Resolve bootstrap package directories to exclude from MT loaders.
    const mainThreadPkgDir = path.resolve(myReactLynxRoot, "dist/main-thread");
    const runtimePkgDir = path.resolve(myReactLynxRoot, "dist/runtime");
    const sharedPkgDir = path.resolve(myReactLynxRoot, "dist/shared");

    // Auto chunk name loader for MT layer too
    chain.module
      .rule("myreact:auto-chunk-name-mt")
      .issuerLayer(LAYERS.MAIN_THREAD)
      .test(/\.[cm]?[jt]sx?$/)
      .exclude.add(/node_modules/)
      .add(mainThreadPkgDir)
      .add(runtimePkgDir)
      .add(sharedPkgDir)
      .end()
      .use("auto-chunk-name-loader")
      .loader(path.resolve(_dirname, "./loaders/auto-chunk-name-loader"))
      .end();

    // JS/TS/TSX on MT: LEPUS worklet transform (extract registerWorkletInternal calls).
    chain.module
      .rule("myreact:worklet-mt")
      .issuerLayer(LAYERS.MAIN_THREAD)
      .test(/\.[cm]?[jt]sx?$/)
      .exclude.add(/node_modules/)
      .add(mainThreadPkgDir)
      .add(runtimePkgDir)
      .add(sharedPkgDir)
      .end()
      .use("worklet-loader-mt")
      .loader(path.resolve(_dirname, "./loaders/worklet-loader-mt"))
      .end();
  });
}
