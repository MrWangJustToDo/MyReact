/**
 * MyReactMarkMainThreadPlugin - Webpack plugin for main-thread asset marking.
 *
 * This plugin does two things:
 * 1. Forces webpack to generate startup code for MT entry chunks.
 * 2. Marks webpack-generated main-thread assets with `lynx:main-thread: true`
 *    so that LynxTemplatePlugin routes them to lepusCode.root (Lepus bytecode).
 */

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
          for (const filename of this.mainThreadFilenames) {
            const asset = compilation.getAsset(filename);
            if (asset) {
              compilation.updateAsset(filename, asset.source, {
                ...asset.info,
                "lynx:main-thread": true,
              });
            }
          }
        }
      );
    });
  }
}
