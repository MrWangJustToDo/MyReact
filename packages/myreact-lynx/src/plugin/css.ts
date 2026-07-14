/**
 * CSS extraction pipeline for MyReact Lynx.
 *
 * Mirrors `@lynx-js/react-rsbuild-plugin`'s `applyCSS()` for Rsbuild 2:
 * 1. Disables `style-loader` (forces CSS extraction via CssExtractPlugin).
 * 2. Replaces the rsbuild-default CssExtract plugin with
 *    `@lynx-js/css-extract-webpack-plugin` which emits Lynx-compatible CSS.
 * 3. Removes `lightningcss-loader` (Lynx has its own CSS processor).
 * 4. Configures the Main-Thread layer to ignore CSS entirely.
 *
 * Rsbuild 2 splits CSS rules into `oneOf` branches — loaders must be applied
 * on `CHAIN_ID.ONE_OF.CSS_MAIN` / `CSS_INLINE` (and sass/less equivalents).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import { LAYERS } from "./layers.js";

import type { CssExtractRspackPluginOptions } from "@lynx-js/css-extract-webpack-plugin";
import type { ChainIdentifier, CSSLoaderOptions, RsbuildPluginAPI, Rspack } from "@rsbuild/core";

export interface ApplyCSSOptions {
  enableCSSSelector: boolean;
  enableCSSInvalidation: boolean;
  /** Whether HMR is enabled (affects CSS hot-update generation) */
  enableHMR?: boolean;
}

const _dirname = path.dirname(fileURLToPath(import.meta.url));

export function applyCSS(api: RsbuildPluginAPI, options: ApplyCSSOptions): void {
  const { enableCSSSelector, enableCSSInvalidation } = options;

  // Force CSS extraction (disable style-loader, enable CssExtractPlugin).
  // Without this, rsbuild injects CSS via JS — useless in Lynx's native env.
  api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
    return mergeRsbuildConfig(config, {
      output: { injectStyles: false },
    });
  });

  // Replace the rsbuild-default CSS extraction plugin with the Lynx-aware
  // one, configure loaders per layer, and remove lightningcss.
  api.modifyBundlerChain(async function handler(chain, { CHAIN_ID, environment }) {
    const isLynx = environment.name === "lynx" || environment.name.startsWith("lynx-");
    const isWeb = environment.name === "web" || environment.name.startsWith("web-");

    const cssRules = [CHAIN_ID.RULE.CSS, CHAIN_ID.RULE.SASS, CHAIN_ID.RULE.LESS, CHAIN_ID.RULE.STYLUS] as const;

    // Only apply Lynx CSS handling for Lynx environments
    // Web preview uses standard CSS handling (no Lynx-specific HMR)
    if (!isLynx) {
      // For web, only remove lightningcss (Lynx doesn't support it)
      if (isWeb) {
        cssRules
          .filter((rule) => chain.module.rules.has(rule))
          .forEach((ruleName) => {
            const rule = chain.module.rule(ruleName);
            for (const name of cssOneOfNames(ruleName, CHAIN_ID)) {
              if (rule.oneOfs.has(name)) {
                removeLightningCSS(rule.oneOf(name), CHAIN_ID);
              }
            }
          });
      }
      return;
    }

    const { CssExtractRspackPlugin } = await import("@lynx-js/css-extract-webpack-plugin");
    const CssExtractPlugin = CssExtractRspackPlugin;

    cssRules
      .filter((rule) => chain.module.rules.has(rule))
      .forEach((ruleName) => {
        const rule = chain.module.rule(ruleName);
        const mainRuleName = ruleName === CHAIN_ID.RULE.CSS ? CHAIN_ID.ONE_OF.CSS_MAIN : ruleName;
        const mainRule = rule.oneOf(mainRuleName);
        const parentRuleEntries = rule.entries() as Rspack.RuleSetRule;

        // Remove lightningcss-loader — Lynx processes CSS natively.
        removeLightningCSS(mainRule, CHAIN_ID);

        // Use the Lynx CssExtract loader for the Background layer.
        mainRule.issuerLayer(LAYERS.BACKGROUND).use(CHAIN_ID.USE.MINI_CSS_EXTRACT).loader(CssExtractPlugin.loader).end();

        // Clone the existing CSS rule chain for the Main-Thread layer.
        // Main-Thread bundles never contain user CSS — only the PAPI
        // bootstrap code. We replace all loaders with ignore-css + a
        // css-loader configured for `exportOnlyLocals: true`.
        const uses = mainRule.uses.entries();
        const ruleEntries = mainRule.entries() as Rspack.RuleSetRule;
        const cssLoaderRule = uses[CHAIN_ID.USE.CSS]?.entries() as Rspack.RuleSetRule | undefined;
        if (!cssLoaderRule) {
          return;
        }

        const mainThreadLayerRule = chain.module
          .rule(`${ruleName}:${LAYERS.MAIN_THREAD}`)
          .test(parentRuleEntries.test!)
          .merge(ruleEntries)
          .issuerLayer(LAYERS.MAIN_THREAD);

        if (parentRuleEntries.dependency !== undefined) {
          mainThreadLayerRule.merge({
            dependency: parentRuleEntries.dependency,
          });
        }

        mainThreadLayerRule
          .use(CHAIN_ID.USE.IGNORE_CSS)
          .loader(path.resolve(_dirname, "./loaders/ignore-css-loader"))
          .end()
          .uses.merge(uses)
          .delete(CHAIN_ID.USE.MINI_CSS_EXTRACT)
          .delete(CHAIN_ID.USE.LIGHTNINGCSS)
          .delete(CHAIN_ID.USE.CSS)
          .end();

        // Re-add css-loader with exportOnlyLocals for main-thread
        mainThreadLayerRule
          .use(CHAIN_ID.USE.CSS)
          .after(CHAIN_ID.USE.IGNORE_CSS)
          .merge(cssLoaderRule)
          .options(normalizeCssLoaderOptions(cssLoaderRule.options as CSSLoaderOptions, true))
          .end();
      });

    // Strip lightningcss from inline CSS oneOf branches.
    cssRules
      .filter((rule) => chain.module.rules.has(rule))
      .forEach((ruleName) => {
        const inlineRuleName = ruleName === CHAIN_ID.RULE.CSS ? CHAIN_ID.ONE_OF.CSS_INLINE : `${ruleName}-inline`;
        const rule = chain.module.rule(ruleName);
        if (rule.oneOfs.has(inlineRuleName)) {
          removeLightningCSS(rule.oneOf(inlineRuleName), CHAIN_ID);
        }
      });

    // Replace the CssExtract plugin instance with the Lynx-aware one
    // and pass through the CSS selector / invalidation options.
    chain
      .plugin(CHAIN_ID.PLUGIN.MINI_CSS_EXTRACT)
      .tap(([pluginOptions]) => {
        return [
          {
            ...pluginOptions,
            enableRemoveCSSScope: true,
            enableCSSSelector,
            enableCSSInvalidation,
            cssPlugins: [],
          } as CssExtractRspackPluginOptions,
        ];
      })
      .init((_, args: unknown[]) => {
        return new CssExtractPlugin(...(args as [options: CssExtractRspackPluginOptions]));
      })
      .end()
      .end();
  });
}

function cssOneOfNames(ruleName: string, CHAIN_ID: ChainIdentifier): string[] {
  if (ruleName === CHAIN_ID.RULE.CSS) {
    return [CHAIN_ID.ONE_OF.CSS_MAIN, CHAIN_ID.ONE_OF.CSS_INLINE, CHAIN_ID.ONE_OF.CSS_RAW, CHAIN_ID.ONE_OF.CSS_URL];
  }
  return [ruleName, `${ruleName}-inline`, `${ruleName}-raw`];
}

function removeLightningCSS(
  rule: {
    uses: {
      has: (id: string) => boolean;
      delete: (id: string) => unknown;
    };
  },
  ids: ChainIdentifier
): void {
  if (rule.uses.has(ids.USE.LIGHTNINGCSS)) {
    rule.uses.delete(ids.USE.LIGHTNINGCSS);
  }
}

/**
 * Force `exportOnlyLocals: true` on the css-loader modules config.
 * Required when the target is not `web` and CSS modules are enabled.
 */
function normalizeCssLoaderOptions(options: CSSLoaderOptions, exportOnlyLocals: boolean): CSSLoaderOptions {
  if (options.modules && exportOnlyLocals) {
    let { modules } = options;
    if (modules === true) {
      modules = { exportOnlyLocals: true };
    } else if (typeof modules === "string") {
      modules = {
        mode: modules as "local",
        exportOnlyLocals: true,
      };
    } else {
      modules = {
        ...modules,
        exportOnlyLocals: true,
      };
    }

    return {
      ...options,
      modules,
    };
  }

  return options;
}
