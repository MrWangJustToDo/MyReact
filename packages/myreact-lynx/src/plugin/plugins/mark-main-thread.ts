/**
 * MyReactMarkMainThreadPlugin - Webpack plugin for main-thread asset marking.
 *
 * This plugin does four things:
 * 1. Forces webpack to generate startup code for MT entry chunks.
 * 2. Marks webpack-generated main-thread assets with `lynx:main-thread: true`
 *    so that LynxTemplatePlugin routes them to lepusCode.root (Lepus bytecode).
 * 3. Marks async main-thread chunk files with `lynx:main-thread: true` so
 *    LynxTemplatePlugin includes them in async template's lepusCode section.
 * 4. Wraps async main-thread chunks with `globDynamicComponentEntry` function
 *    wrapper that the web simulator/LEPUS runtime expects.
 * 5. Normalizes async chunk names between layers using LynxTemplatePlugin's
 *    `asyncChunkName` hook (removes layer suffixes).
 */

import { LynxTemplatePlugin } from "@lynx-js/template-webpack-plugin";

import { LAYERS } from "../layers.js";

import type { WebpackCompiler } from "../types";

export const PLUGIN_MARK_MAIN_THREAD = "lynx:myreact-mark-main-thread";

export class MyReactMarkMainThreadPlugin {
  constructor(private readonly mainThreadFilenames: string[]) {}

  apply(compiler: WebpackCompiler): void {
    const { RuntimeGlobals } = compiler.webpack;

    compiler.hooks.thisCompilation.tap(PLUGIN_MARK_MAIN_THREAD, (compilation) => {
      // Force startup code generation for MT entry chunks so that
      // entry module factories actually execute.
      compilation.hooks.additionalTreeRuntimeRequirements.tap(PLUGIN_MARK_MAIN_THREAD, (chunk, set) => {
        const entryOptions = chunk.getEntryOptions();
        if (entryOptions?.layer === LAYERS.MAIN_THREAD) {
          set.add(RuntimeGlobals.startup);
          set.add(RuntimeGlobals.require);
        }
      });

      // Mark MT assets with lynx:main-thread: true for LynxTemplatePlugin.
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_MARK_MAIN_THREAD,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          // Mark static main-thread entry files
          for (const filename of this.mainThreadFilenames) {
            const asset = compilation.getAsset(filename);
            if (asset) {
              compilation.updateAsset(filename, asset.source, {
                ...asset.info,
                "lynx:main-thread": true,
              });
            }
          }

          // Mark async main-thread chunk files
          // Find async ChunkGroups where all origins are from MAIN_THREAD layer
          for (const chunkGroup of compilation.chunkGroups) {
            if (chunkGroup.isInitial()) continue;

            const isMainThreadOrigin = chunkGroup.origins.every((origin) => origin.module?.layer === LAYERS.MAIN_THREAD);

            if (!isMainThreadOrigin) continue;

            // Mark all JS files in this async chunk as main-thread
            const files = chunkGroup.getFiles();
            for (const filename of files) {
              if (!filename.endsWith(".js")) continue;

              const asset = compilation.getAsset(filename);
              if (asset) {
                compilation.updateAsset(filename, asset.source, {
                  ...asset.info,
                  "lynx:main-thread": true,
                });
              }
            }
          }
        }
      );

      // Wrap async main-thread chunks with globDynamicComponentEntry wrapper.
      // This is the format that the web simulator/LEPUS runtime expects for
      // dynamically loaded LEPUS code.
      const { ConcatSource } = compiler.webpack.sources;
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_MARK_MAIN_THREAD,
          // Run after OPTIMIZE_SIZE (minification) but before DEV_TOOLING (sourcemaps)
          // to ensure the wrapper is added after minification but before sourcemap generation.
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE + 1,
        },
        () => {
          for (const chunkGroup of compilation.chunkGroups) {
            // Only process async chunks from main-thread layer
            const isDynamicImport = !chunkGroup.isInitial() && chunkGroup.origins.every((origin) => origin.module?.layer === LAYERS.MAIN_THREAD);

            if (!isDynamicImport) continue;

            for (const chunk of chunkGroup.chunks) {
              for (const file of chunk.files) {
                if (!file.endsWith(".js")) continue;

                const asset = compilation.getAsset(file);
                if (!asset) continue;

                // Wrap with globDynamicComponentEntry function
                compilation.updateAsset(
                  file,
                  (old) =>
                    new ConcatSource(
                      "(function (globDynamicComponentEntry) {\n",
                      "  const module = { exports: {} };\n",
                      "  const exports = module.exports;\n",
                      old,
                      "\n  ;return module.exports;\n})"
                    )
                );
              }
            }
          }
        }
      );

      // biome-ignore lint/suspicious/noExplicitAny: rspack/webpack compilation type mismatch
      const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(compilation as any);

      // Normalize async chunk names between layers.
      // Remove layer suffixes so both layers' async chunks get the same name,
      // allowing LynxTemplatePlugin to bundle them together.
      //
      // Also filter out auto-generated chunk names (no webpackChunkName provided).
      // User-provided webpackChunkName values are simple identifiers (letters, numbers, hyphens).
      // Auto-generated names contain underscores, dots, slashes, or file extensions.
      // Returning empty string skips async template generation for non-user-provided names.
      hooks.asyncChunkName.tap(PLUGIN_MARK_MAIN_THREAD, (chunkName: string) =>
        chunkName?.replaceAll("-myreact__background", "").replaceAll("-myreact__main-thread", "")
      );

      // Provide a minimal stub for async bundles without main-thread content.
      // When a lazy component doesn't have worklet code, the main-thread async
      // chunk is effectively empty. But the web simulator expects lepusCode.root
      // to exist. We provide a minimal stub that exports an empty object.
      const { RawSource } = compiler.webpack.sources;
      // biome-ignore lint/suspicious/noExplicitAny: hook args type is complex
      hooks.beforeEncode.tap(PLUGIN_MARK_MAIN_THREAD, (args: any) => {
        const { encodeData } = args;

        // Only for async bundles (appType: 'DynamicComponent')
        if (encodeData.sourceContent?.appType !== "DynamicComponent") {
          return args;
        }

        // If lepusCode.root is undefined/empty, provide a minimal stub
        if (!encodeData.lepusCode?.root) {
          const stubCode = `(function (globDynamicComponentEntry) {
  const module = { exports: {} };
  const exports = module.exports;
  ;return module.exports;
})`;
          encodeData.lepusCode = encodeData.lepusCode || {};
          encodeData.lepusCode.root = {
            name: "__stub__.js",
            source: new RawSource(stubCode),
            info: { "lynx:main-thread": true },
          };
          encodeData.lepusCode.filename = "__stub__.js";
        }

        return args;
      });
    });
  }
}
