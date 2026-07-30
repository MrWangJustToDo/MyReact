import path from "node:path";
import { fileURLToPath } from "node:url";

import { THREAD_DEFINES_BY_LAYER } from "./loaders/thread-defines-loader.js";

import type { RsbuildPluginAPI } from "@rsbuild/core";

const _dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Apply per-layer compile-time thread macros.
 *
 * Rspack's DefinePlugin does not support per-module layer values, so we run a
 * lightweight text substitution loader on each webpack layer instead of SWC.
 *
 * Registered as `enforce: "pre"`, but MUST be added to the chain before the
 * worklet loaders (also `enforce: "pre"`). Later-registered pre loaders run
 * first on the source: worklet transform sees unsubstituted macros so BG/MT
 * `_wkltId`s match; this loader then rewrites `__BACKGROUND__` / etc.
 */
export function applyThreadDefines(api: RsbuildPluginAPI): void {
  const loaderPath = path.resolve(_dirname, "./loaders/thread-defines-loader");

  api.modifyBundlerChain((chain) => {
    for (const [layer, vars] of Object.entries(THREAD_DEFINES_BY_LAYER)) {
      chain.module
        .rule(`myreact:thread-defines-${layer}`)
        .test(/\.(?:[cm]?[jt]s|tsx)$/)
        .issuerLayer(layer)
        .enforce("pre")
        .use(`myreact:thread-defines-${layer}`)
        .loader(loaderPath)
        .options(vars);
    }
  });
}
