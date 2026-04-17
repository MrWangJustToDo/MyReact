/**
 * Dual-thread entry splitting for MyReact Lynx.
 *
 * Sets up the webpack configuration for Lynx's dual-thread architecture:
 * - Background Thread: runs the MyReact reconciler and user app
 * - Main Thread (LEPUS): executes PAPI operations and worklets
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

  // Apply worklet loaders if enabled
  if (opts.enableWorkletTransform) {
    applyWorkletLoaders(api);
  }

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

      // Main Thread bundle – PAPI bootstrap + worklet runtime
      // Only include user code when worklet transform is enabled (for 'main thread' directive extraction).
      // Otherwise, user code with root.render() should only run in the background thread.
      const mainThreadImports = opts.enableWorkletTransform ? [entryMainThreadPath, workletRuntimePath, ...imports] : [entryMainThreadPath, workletRuntimePath];

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
              enableNewGesture: false,
              removeDescendantSelectorScope: true,
              cssPlugins: [],
            },
          ])
          .end();
      }
    }

    // MyReactMarkMainThreadPlugin – mark MT assets
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

    // RuntimeWrapperWebpackPlugin – wrap background.js, not main-thread.js
    if (isLynx) {
      chain
        .plugin(PLUGIN_RUNTIME_WRAPPER)
        .use(RuntimeWrapperWebpackPlugin, [
          {
            // Exclude main-thread.js (and main-thread.[hash].js) from wrapping
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
 * Worklet loaders are disabled by default because @lynx-js/react/transform
 * transforms ALL JSX into ReactLynx-specific snapshot code, which is
 * incompatible with MyReact's standard React rendering approach.
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
