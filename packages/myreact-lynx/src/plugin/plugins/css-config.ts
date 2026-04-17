/**
 * MyReactCSSConfigPlugin - Webpack plugin for CSS config injection.
 *
 * Injects Lynx engine compiler options into the encoded template
 * via the LynxTemplatePlugin beforeEncode hook.
 */

import { LynxTemplatePlugin } from "@lynx-js/template-webpack-plugin";

import type { WebpackCompiler } from "../types";

export const PLUGIN_CSS_CONFIG = "lynx:myreact-css-config";

export class MyReactCSSConfigPlugin {
  constructor(private readonly compilerOptions: Record<string, unknown>) {}

  apply(compiler: WebpackCompiler): void {
    compiler.hooks.thisCompilation.tap(PLUGIN_CSS_CONFIG, (compilation) => {
      const hooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(
        // @ts-expect-error Rspack x Webpack compilation type mismatch
        compilation
      ) as {
        beforeEncode: {
          tap(name: string, fn: (args: Record<string, unknown>) => Record<string, unknown>): void;
        };
      };
      hooks.beforeEncode.tap(PLUGIN_CSS_CONFIG, (args) => {
        const encodeData = args["encodeData"] as {
          sourceContent: { config: Record<string, unknown> };
        };
        Object.assign(encodeData.sourceContent.config, this.compilerOptions);
        return args;
      });
    });
  }
}
