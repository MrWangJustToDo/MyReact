/**
 * Webpack loader for the Main Thread (LEPUS) layer (`issuerLayer: MAIN_THREAD`).
 *
 * Default (IFR off): keep relative / allowlisted-package side-effect imports and
 * extract bare `registerWorkletInternal(...)` so worklets register without
 * running React/component module bodies.
 *
 * IFR on: keep executable module code on MT (JS worklet transform) and append
 * bare LEPUS registrations **plus** `with { runtime: 'shared' }` imports.
 * The JS transform turns worklet bodies into stubs and drops those shared
 * imports, but registration bodies still close over them (`motionValue`, …).
 * Dropping exports breaks package re-exports (`PanGesture`, `useMotionValueRefEvent`).
 *
 * BG `worklet-loader` is JS-only (no register / shared re-attach) — not identical.
 *
 * **Do not emit full SWC LEPUS for npm worklet packages** when IFR is off — that
 * output gates registration with `loadWorkletRuntime(...) && registerWorkletInternal(...)`.
 *
 * @see packages/myreact-lynx/IFR.md §4
 */

import { transformReactLynxSync } from "@lynx-js/react/transform";

import { WORKLET_NODE_MODULES_PACKAGES } from "../worklet-packages.js";

import { extractLocalImports, extractRegistrations, extractSharedImports, extractWorkletPackageSideEffectImports } from "./worklet-utils.js";

import type { Rspack } from "@rsbuild/core";

export type WorkletLoaderMTOptions = {
  workletPackages?: string[];
  enableIFR?: boolean;
};

function shouldPassThroughOnMT(resourcePath: string): boolean {
  return /[\\/]polyfill[\\/]/.test(resourcePath) || /[\\/](?:shim|polyfill)\.[cm]?js$/.test(resourcePath);
}

function emitLepusStitch(source: string, filename: string, localImports: string, workletPkgImports: string, emitError: (err: Error) => void): string {
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
      emitError(new Error(`[worklet-loader-mt] LEPUS transform: ${err.text}`));
    }
    return localImports || "";
  }

  const sharedImports = extractSharedImports(lepusResult.code);
  const registrations = extractRegistrations(lepusResult.code);
  return [localImports, workletPkgImports, sharedImports, registrations].filter(Boolean).join("\n");
}

export default function workletLoaderMT(this: Rspack.LoaderContext<WorkletLoaderMTOptions>, source: string): string {
  this.cacheable(true);

  const { workletPackages = [...WORKLET_NODE_MODULES_PACKAGES], enableIFR = false } = this.getOptions?.() ?? {};
  const localImports = extractLocalImports(source);
  const workletPkgImports = shouldPassThroughOnMT(this.resourcePath) ? "" : extractWorkletPackageSideEffectImports(source, workletPackages);

  // Polyfill/shim: keep as-is (no worklet bodies; may set globals).
  if (shouldPassThroughOnMT(this.resourcePath)) {
    return source;
  }

  const hasMainThread = source.includes("'main thread'") || source.includes('"main thread"');

  // IFR: keep module bodies (and named exports) so sync mount / package
  // re-exports work. Worklet registrations are appended when present.
  if (enableIFR && !hasMainThread) {
    const parts = [source, workletPkgImports].filter(Boolean);
    return parts.join("\n");
  }

  if (!hasMainThread) {
    const sharedImports = extractSharedImports(source);
    const parts = [localImports, workletPkgImports, sharedImports].filter(Boolean);
    return parts.join("\n");
  }

  const filename = this.resourcePath;

  if (enableIFR) {
    // Runnable code + exports (worklets → context objects) + bare registrations.
    // Must re-attach shared-runtime imports: JS transform drops them after
    // worklet bodies become stubs, but registerWorkletInternal still needs them
    // (e.g. `return motionValue(init, options)` in @lynx-js/motion).
    const jsResult = transformReactLynxSync(source, {
      pluginName: "myreact:worklet-mt-ifr-js",
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
        target: "JS",
        filename,
        runtimePkg: "@my-react/react-lynx",
      },
    });

    const lepusResult = transformReactLynxSync(source, {
      pluginName: "myreact:worklet-mt-ifr-lepus",
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

    if (jsResult.errors.length > 0) {
      for (const err of jsResult.errors) {
        this.emitError(new Error(`[worklet-loader-mt] IFR JS transform: ${err.text}`));
      }
    }
    if (lepusResult.errors.length > 0) {
      for (const err of lepusResult.errors) {
        this.emitError(new Error(`[worklet-loader-mt] IFR LEPUS transform: ${err.text}`));
      }
    }

    const sharedImports = lepusResult.errors.length === 0 ? extractSharedImports(lepusResult.code) : extractSharedImports(source);
    const registrations = lepusResult.errors.length === 0 ? extractRegistrations(lepusResult.code) : "";
    const jsCode = jsResult.errors.length === 0 ? jsResult.code : source;
    const parts = [jsCode, workletPkgImports, sharedImports, registrations].filter(Boolean);
    return parts.join("\n");
  }

  return emitLepusStitch(source, filename, localImports, workletPkgImports, (e) => this.emitError(e));
}
