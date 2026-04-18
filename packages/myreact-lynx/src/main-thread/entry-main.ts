/**
 * Main Thread (Lepus) bootstrap entry.
 *
 * main-thread bundle.  Sets up:
 *   - globalThis.processData   – required by Lynx Lepus runtime (data processor)
 *   - globalThis.renderPage    – creates the Lynx page root (id=1)
 *   - globalThis.updatePage    – no-op stub (required by Lynx Lepus runtime)
 *   - globalThis.reactPatchUpdate – receives ops from Background Thread
 *   - globalThis.processEvalResult – processes lazy bundle exports
 *   - lynx.loadLazyBundle      – for chunk loading runtime (async bundles)
 */

import { elements, setPageUniqueId } from "./element-registry.js";
import { applyOps, resetMainThreadState } from "./ops-apply.js";
import { runOnBackground } from "./run-on-background-mt.js";

const g = globalThis as Record<string, unknown>;

// Register processEvalResult for lazy bundle loading.
// When a lazy bundle is loaded, the web simulator calls:
//   processEvalResult(bundleExports, bundleUrl)
// The bundleExports is a function: (globDynamicComponentEntry) => module.exports
// We call it with the bundleUrl to match ReactLynx's behavior.
if (typeof g["processEvalResult"] === "undefined") {
  g["processEvalResult"] = function <T>(result: T | undefined, schema: string): T | undefined {
    // If result is a function (the wrapped bundle), call it with the URL
    if (typeof result === "function") {
      return (result as (url: string) => T)(schema);
    }
    return result;
  };
}

// Register loadLazyBundle on lynx global BEFORE any chunk loading code runs.
// This is required for React.lazy() with dynamic imports to work.
// The chunk loading runtime uses lynx.loadLazyBundle() to load async template bundles.
// On main thread (LEPUS), we use __QueryComponent for synchronous loading.
if (typeof lynx !== "undefined") {
  (lynx as unknown as { loadLazyBundle: <T>(source: string) => Promise<T> }).loadLazyBundle = function loadLazyBundle<T>(source: string): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - __QueryComponent is a Lynx PAPI
    const query = __QueryComponent(source);
    let result: T;
    try {
      result = query.evalResult as T;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // Return a never-resolving promise to avoid errors on first screen
      return new Promise(() => {});
    }
    return Promise.resolve(result);
  };
}

// Set runtime thread identification globals
// These can be used for runtime checks when compile-time defines aren't available
g["__BACKGROUND_RUNTIME__"] = false;
g["__MAIN_THREAD_RUNTIME__"] = true;

// Expose SystemInfo on globalThis (the worklet-runtime reads it).
// In React's main-thread bundle this is done by the generated snapshot code.
g["SystemInfo"] = (typeof lynx !== "undefined" && lynx.SystemInfo) ?? {};

// Register runOnBackground as a global — extracted LEPUS worklet code calls it
// as a bare identifier (the SWC transform generates `runOnBackground(_jsFnK)`).
g["runOnBackground"] = runOnBackground;

// The worklet-runtime (from @lynx-js/react) is bundled into this
// main-thread entry by the myreact-lynx plugin — it provides:
//   globalThis.runWorklet, globalThis.registerWorkletInternal,
//   globalThis.lynxWorkletImpl (with Element class, Animation, etc.)

/** PAGE_ROOT_ID must match the value in runtime/src/shadow-element.ts */
const PAGE_ROOT_ID = 1;

// Lynx Lepus runtime requires globalThis.processData to be set.
// It is called to transform initial data before renderPage runs.
// Data processors are registered via registerDataProcessors() on the BG thread.
g["processData"] = function (data: unknown, _processorName?: string): unknown {
  return data ?? {};
};

// Lynx calls renderPage on the Main Thread first (before Background JS runs).
// We create the root page element and store it as id=1 so Background ops that
// target the root can resolve it correctly.
g["renderPage"] = function (_data: unknown): void {
  // Clear all element state from the previous page. This is essential for:
  // 1. Testing: prevents duplicate batch detection from skipping ops
  //    when ShadowElement IDs restart from 2 between test renders.
  // 2. Hot reload: ensures stale element handles don't persist.
  resetMainThreadState();
  const page = __CreatePage("0", 0);
  // Set global CSS scope on page so its style_sheet_manager_ is populated.
  // This matches ReactLynx 3.0's root snapshot: __SetCSSId([__page], 0).
  __SetCSSId([page], 0);
  setPageUniqueId(__GetElementUniqueID(page));
  elements.set(PAGE_ROOT_ID, page);
  __FlushElementTree(page);
};

// Lynx may call updatePage / updateGlobalProps after data changes.
// MyReact handles data updates on the Background Thread, so these are no-ops.
g["updatePage"] = function (_data: unknown): void {
  // no-op: MyReact handles data updates on Background Thread
};

g["updateGlobalProps"] = function (_data: unknown): void {
  // no-op
};

// Called by the BG Thread via callLepusMethod('reactPatchUpdate', { data }).
g["reactPatchUpdate"] = function ({ data }: { data: string }): void {
  const ops = JSON.parse(data) as unknown[];
  applyOps(ops);
};

// Called by the BG Thread via callLepusMethod('updateMTRefInitValue', { data }).
// This updates the worklet ref initial values in the worklet-runtime.
g["updateMTRefInitValue"] = function ({ data }: { data: string }): void {
  const patch = JSON.parse(data) as [id: number, value: unknown][];
  // The worklet-runtime from @lynx-js/react provides updateWorkletRefInitValueChanges
  const updateFn = (globalThis as Record<string, unknown>)["updateWorkletRefInitValueChanges"] as ((patch: [number, unknown][]) => void) | undefined;
  if (updateFn) {
    updateFn(patch);
  }
};

// Worklet registrations are included in this bundle via webpack's dependency
// graph — user code on the MT layer is processed by worklet-loader-mt which
// extracts registerWorkletInternal() calls per-entry.
