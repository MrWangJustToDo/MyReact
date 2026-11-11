/**
 * Webpack loader for the Main Thread (LEPUS) layer (`issuerLayer: MAIN_THREAD`).
 *
 * Default (IFR off): keep relative / allowlisted-package side-effect imports and
 * extract bare `registerWorkletInternal(...)` so worklets register without
 * running React/component module bodies.  Runtime-package root imports are
 * resolved to the MT-only facade (`@my-react/react-lynx/mt`) by the plugin, so
 * the transform-injected `captureMainThreadObject` import never reaches the
 * background barrel.
 *
 * IFR on: keep executable module code on MT (JS worklet transform) and append
 * bare LEPUS registrations **plus** `with { runtime: 'shared' }` imports.
 * The JS transform turns worklet bodies into stubs and drops those shared
 * imports, but registration bodies still close over them (`motionValue`, …).
 * Dropping exports breaks package re-exports (`PanGesture`, `useMotionValueRefEvent`).
 *
 * BG `worklet-loader` is JS-only (no register / shared re-attach) — not identical.
 *
 * ReactLynx 0.128+ emits `__registerWorklet(...)` imported from
 * `<runtimePkg>/worklet-runtime/init`; older versions emitted
 * `loadWorkletRuntime(...) && registerWorkletInternal(...)`. The extractor
 * normalizes both forms to a bare `registerWorkletInternal(...)`, while the
 * Main Thread entry imports the runtime init so the global registrar exists.
 *
 * Do **not** emit full SWC LEPUS for npm worklet packages when IFR is off —
 * that output carries the runtime import/guard and is intended for a single
 * self-contained main-thread program, not our split BG/MT graph.
 *
 * @see packages/myreact-lynx/IFR.md §4
 */

import { transformReactLynxSync } from "@lynx-js/react/transform";

import { createWorkletPackagesPathTest, WORKLET_NODE_MODULES_PACKAGES } from "../worklet-packages.js";

import { extractLocalImports, extractRegistrations, extractSharedImports, extractWorkletPackageSideEffectImports } from "./worklet-utils.js";

import type { Rspack } from "@rsbuild/core";

export type WorkletLoaderMTOptions = {
  workletPackages?: string[];
  enableIFR?: boolean;
};

function shouldPassThroughOnMT(resourcePath: string): boolean {
  return /[\\/]polyfill[\\/]/.test(resourcePath) || /[\\/](?:shim|polyfill)\.[cm]?js$/.test(resourcePath);
}

function importsReactRuntime(source: string): boolean {
  return /from\s+["'](?:@lynx-js\/react|react)["']/.test(source);
}

/**
 * Plain runtime modules in a worklet package need their exports on MT (motion's
 * upstream/full.js, v~1.js, utility modules).  Public entry points and hooks do
 * not: keeping them would execute their `@lynx-js/react` imports on MT and pull
 * the background renderer into the main-thread bundle.
 */
function shouldPreserveWorkletPackageModule(resourcePath: string, source: string): boolean {
  const normalized = resourcePath.replace(/\\/g, "/");
  if (/\/hooks\//.test(normalized) || /\/index\.js$/.test(normalized)) {
    return false;
  }
  if (importsReactRuntime(source)) {
    return false;
  }
  return true;
}

/**
 * Keep named exports linkable when a module body is intentionally stripped on
 * MT.  The values are stubs; background-thread code owns the real bindings.
 */
function createExportStubs(source: string): string {
  const names = new Set<string>();
  const addName = (name: string) => {
    const cleaned = name.trim().replace(/^type\s+/, "");
    if (cleaned && cleaned !== "default") names.add(cleaned);
  };
  const addSpecifier = (specifier: string) => {
    const parts = specifier.trim().split(/\s+as\s+/);
    addName(parts[1] ?? parts[0] ?? "");
  };

  let match: RegExpExecArray | null;
  const exportListRe = /export\s*\{([\s\S]*?)\}\s*(?:from\s*["'][^"']+["'])?\s*;?/g;
  while ((match = exportListRe.exec(source)) !== null) {
    for (const specifier of (match[1] ?? "").split(",")) addSpecifier(specifier);
  }

  const declarationRe = /export\s+(?:async\s+)?(?:class|function|const|let|var)\s+([A-Za-z_$][\w$]*)/g;
  while ((match = declarationRe.exec(source)) !== null) addName(match[1] ?? "");

  const namespaceRe = /export\s*\*\s*as\s+([A-Za-z_$][\w$]*)\s+from/g;
  while ((match = namespaceRe.exec(source)) !== null) addName(match[1] ?? "");

  const stubs = [...names].map((name) => `export const ${name} = undefined;`);
  if (/export\s+default\b/.test(source)) {
    stubs.push("export default undefined;");
  }

  // `export *` cannot be stubbed by name; keep it and let the target module
  // provide its own exports (runtime modules that need real values are
  // preserved above).
  const starRe = /export\s*\*\s*from\s*["'][^"']+["']\s*;?/g;
  while ((match = starRe.exec(source)) !== null) stubs.push(match[0]);

  return stubs.join("\n");
}

function emitLepusStitch(
  source: string,
  filename: string,
  localImports: string,
  workletPkgImports: string,
  exportStubs: string,
  emitError: (err: Error) => void
): string {
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
      runtimePkg: "@lynx-js/react",
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
  return [localImports, workletPkgImports, sharedImports, registrations, exportStubs].filter(Boolean).join("\n");
}

export default function workletLoaderMT(this: Rspack.LoaderContext<WorkletLoaderMTOptions>, source: string): string {
  this.cacheable(true);

  const { workletPackages = [...WORKLET_NODE_MODULES_PACKAGES], enableIFR = false } = this.getOptions?.() ?? {};
  const localImports = extractLocalImports(source);
  const isWorkletPackageModule = createWorkletPackagesPathTest(workletPackages).test(this.resourcePath);
  const workletPkgImports = shouldPassThroughOnMT(this.resourcePath) ? "" : extractWorkletPackageSideEffectImports(source, workletPackages);

  // Polyfill/shim: keep as-is (no worklet bodies; may set globals).
  if (shouldPassThroughOnMT(this.resourcePath)) {
    return source;
  }

  const hasMainThread = source.includes("'main thread'") || source.includes('"main thread"');

  // Worklet packages also contain plain runtime modules (e.g. motion's
  // upstream/full.js, v~1.js) that are imported by worklet bodies and must
  // keep their exports.  Only strip non-worklet modules outside these
  // packages; app modules still contribute dependency edges only.
  if (!hasMainThread && isWorkletPackageModule && shouldPreserveWorkletPackageModule(this.resourcePath, source)) {
    return source;
  }

  // IFR: keep module bodies (and named exports) so sync mount / package
  // re-exports work. Worklet registrations are appended when present.
  if (enableIFR && !hasMainThread) {
    const parts = [source, workletPkgImports].filter(Boolean);
    return parts.join("\n");
  }

  if (!hasMainThread) {
    const sharedImports = extractSharedImports(source);
    // Public worklet-package entry/hook modules are stripped to dependency
    // edges, but consumers may still import their names.  Stub those exports
    // so ESM linking succeeds without executing React code on MT.
    const exportStubs = isWorkletPackageModule ? createExportStubs(source) : "";
    const parts = [localImports, workletPkgImports, sharedImports, exportStubs].filter(Boolean);
    return parts.join("\n");
  }

  const filename = this.resourcePath;

  if (enableIFR || (isWorkletPackageModule && !importsReactRuntime(source))) {
    // Runnable code + exports (worklets → context objects) + bare registrations.
    // Must re-attach shared-runtime imports: JS transform drops them after
    // worklet bodies become stubs, but registerWorkletInternal still needs them
    // (e.g. `return motionValue(init, options)` in @lynx-js/motion).
    //
    // Worklet-package modules need the same treatment even when IFR is off:
    // their index files re-export named bindings from modules containing
    // `'main thread'` functions, and stripping those exports breaks ESM
    // linking (e.g. @lynx-js/motion/dist/index.js → animation/index.js).
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
        runtimePkg: "@lynx-js/react",
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
        runtimePkg: "@lynx-js/react",
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

  return emitLepusStitch(source, filename, localImports, workletPkgImports, isWorkletPackageModule ? createExportStubs(source) : "", (e) => this.emitError(e));
}
