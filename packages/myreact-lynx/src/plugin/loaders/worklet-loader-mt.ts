/**
 * Webpack loader for the Main Thread (LEPUS) layer (`issuerLayer: MAIN_THREAD`).
 *
 * Keeps relative / allowlisted-package side-effect imports and extracts bare
 * `registerWorkletInternal(...)` calls so worklets register without running
 * React/component module bodies.
 *
 * **Do not emit full SWC LEPUS for npm worklet packages.** That output gates
 * registration with `loadWorkletRuntime(...) && registerWorkletInternal(...)`.
 * Official `loadWorkletRuntime` returns `false` when `__LoadLepusChunk` is
 * undefined (MT entry already bundles worklet-runtime) → skipped register →
 * `_workletMap[id]` missing → `.bind is not a function`.
 *
 * Layering (Rspack default) duplicates modules per layer, so MT stitches that
 * drop exports do not clear BG `BaseGesture` / `@lynx-js/motion` APIs.
 *
 * NOTE: Do NOT preserve dynamic imports on the MT layer (empty async chunks).
 */

import { transformReactLynxSync } from "@lynx-js/react/transform";

import { WORKLET_NODE_MODULES_PACKAGES } from "../worklet-packages.js";
import {
  extractLocalImports,
  extractRegistrations,
  extractSharedImports,
  extractWorkletPackageSideEffectImports,
} from "./worklet-utils.js";

import type { Rspack } from "@rsbuild/core";

function shouldPassThroughOnMT(resourcePath: string): boolean {
  return /[\\/]polyfill[\\/]/.test(resourcePath) || /[\\/](?:shim|polyfill)\.[cm]?js$/.test(resourcePath);
}

export default function workletLoaderMT(this: Rspack.LoaderContext, source: string): string {
  this.cacheable(true);

  const localImports = extractLocalImports(source);
  const workletPkgImports = shouldPassThroughOnMT(this.resourcePath)
    ? ""
    : extractWorkletPackageSideEffectImports(source, WORKLET_NODE_MODULES_PACKAGES);

  // Polyfill/shim: keep as-is (no worklet bodies; may set globals).
  if (shouldPassThroughOnMT(this.resourcePath)) {
    return source;
  }

  const hasMainThread = source.includes("'main thread'") || source.includes('"main thread"');

  if (!hasMainThread) {
    const sharedImports = extractSharedImports(source);
    const parts = [localImports, workletPkgImports, sharedImports].filter(Boolean);
    return parts.join("\n");
  }

  const filename = this.resourcePath;

  const lepusResult = transformReactLynxSync(source, {
    pluginName: "myreact:worklet-mt",
    filename,
    sourcemap: false,
    snapshot: false,
    cssScope: false,
    shake: false,
    compat: false,
    refresh: false,
    defineDCE: false,
    directiveDCE: false,
    dynamicImport: false,
    worklet: {
      target: "LEPUS",
      filename,
      runtimePkg: "@my-react/react-lynx",
    },
  });

  if (lepusResult.errors.length > 0) {
    for (const err of lepusResult.errors) {
      this.emitError(new Error(`[worklet-loader-mt] LEPUS transform: ${err.text}`));
    }
    return localImports || "";
  }

  const sharedImports = extractSharedImports(lepusResult.code);
  const registrations = extractRegistrations(lepusResult.code);
  const parts = [localImports, workletPkgImports, sharedImports, registrations].filter(Boolean);
  return parts.join("\n");
}
