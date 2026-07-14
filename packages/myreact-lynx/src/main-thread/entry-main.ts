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

import "../shared/lynx-globals-polyfill.js";

import { parsePatchPayload, type DelayedRunOnMainThreadPayload } from "../shared/patch-payload.js";
import { onFirstScreenPatchFinished } from "../shared/worklet-bindings.js";

import { elements, setPageUniqueId } from "./element-registry.js";
import { resetFirstScreenPatchState, setFirstScreenPatch } from "./first-screen-patch.js";
import { loadLazyBundleOnMainThread } from "./load-lazy-bundle-mt.js";
import { applyOps, resetMainThreadState } from "./ops-apply.js";
import { runOnBackground } from "./run-on-background-mt.js";

const g = globalThis as Record<string, unknown>;

/** Fallback for legacy bare-array patch payloads. */
let legacyFirstScreenPatchPending = true;

function getWorkletRefImpl():
  | {
      updateWorkletRefInitValueChanges?: (patch: [number, unknown][]) => void;
    }
  | undefined {
  const impl = g["lynxWorkletImpl"] as
    | {
        _refImpl?: {
          updateWorkletRefInitValueChanges?: (patch: [number, unknown][]) => void;
        };
      }
    | undefined;
  return impl?._refImpl;
}

/** Seed MainThreadRefs before ops / delayed worklets access them. */
function applyWorkletRefInitValues(patch: [number, unknown][] | undefined): void {
  if (!patch?.length) {
    return;
  }
  const refImpl = getWorkletRefImpl();
  if (refImpl?.updateWorkletRefInitValueChanges) {
    refImpl.updateWorkletRefInitValueChanges(patch);
    return;
  }
  if (__DEV__) {
    throw new Error(
      "[@my-react/react-lynx] lynxWorkletImpl._refImpl.updateWorkletRefInitValueChanges is unavailable; " +
        "MainThreadRef.current will be undefined in worklets."
    );
  }
}

/**
 * Run worklets that were deferred so they execute after ops / ref inits in the
 * same patch — matches official ReactLynx `updateMainThread` ordering.
 */
function runDelayedRunOnMainThreadData(items: DelayedRunOnMainThreadPayload[] | undefined): void {
  if (!items?.length) {
    return;
  }

  const impl = g["lynxWorkletImpl"] as
    | {
        _workletMap?: Record<string, unknown>;
        _runRunOnMainThreadTask?: (worklet: Worklet, params: unknown[], resolveId: number) => void;
      }
    | undefined;

  const runTask = impl?._runRunOnMainThreadTask;
  if (!runTask) {
    if (__DEV__) {
      throw new Error(
        "[@my-react/react-lynx] lynxWorkletImpl._runRunOnMainThreadTask is unavailable; " + "delayed runOnMainThread calls from this patch will be skipped."
      );
    }
    return;
  }

  for (const data of items) {
    const id = (data.worklet as { _wkltId?: string } | undefined)?._wkltId;
    if (__DEV__ && id && impl?._workletMap && !(id in impl._workletMap)) {
      throw new Error(
        `[@my-react/react-lynx] delayed runOnMainThread: worklet "${id}" is not registered on MT ` +
          "(BG/MT _wkltId mismatch or worklet-loader-mt missed the file)."
      );
    }
    runTask(data.worklet, data.params, data.resolveId);
  }
}

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
  (lynx as unknown as { loadLazyBundle: typeof loadLazyBundleOnMainThread }).loadLazyBundle = loadLazyBundleOnMainThread;
}

// Set runtime thread identification globals
// These can be used for runtime checks when compile-time defines aren't available
g["__BACKGROUND_RUNTIME__"] = false;
g["__MAIN_THREAD_RUNTIME__"] = true;

// Match official ReactLynx setupLynxEnv: host injects lynx.SystemInfo
// (including lynxSdkVersion). worklet-runtime gates rAF on SDK > 2.15 — if the
// host omits the field it defaults to "1.0" and rAF throws; do not hardcode a
// fake version here.
g["SystemInfo"] = (typeof lynx !== "undefined" && (lynx as { SystemInfo?: unknown }).SystemInfo) || {};

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
  resetFirstScreenPatchState();
  legacyFirstScreenPatchPending = true;
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
  const payload = parsePatchPayload(data);
  const isFirstScreen = payload.isFirstScreen ?? legacyFirstScreenPatchPending;
  const endFirstScreen = payload.endFirstScreen ?? false;

  // 1) Seed MainThreadRefs  2) apply element ops  3) delayed runOnMainThread
  applyWorkletRefInitValues(payload.workletRefInitValues);

  if (isFirstScreen && payload.ops.length > 0) {
    setFirstScreenPatch(true);
    try {
      applyOps(payload.ops);
    } finally {
      setFirstScreenPatch(false);
    }
  } else if (payload.ops.length > 0) {
    applyOps(payload.ops);
  }

  // After elements + SET_MT_REF are applied — same point as official ReactLynx.
  runDelayedRunOnMainThreadData(payload.delayedRunOnMainThreadData);

  if (endFirstScreen) {
    onFirstScreenPatchFinished();
    legacyFirstScreenPatchPending = false;
  } else if (isFirstScreen) {
    legacyFirstScreenPatchPending = true;
  }
};

// Called by the BG Thread via callLepusMethod('updateMTRefInitValue', { data }).
// Legacy / leftover path — prefer in-patch `workletRefInitValues`.
g["updateMTRefInitValue"] = function ({ data }: { data: string }): void {
  applyWorkletRefInitValues(JSON.parse(data) as [id: number, value: unknown][]);
};

// Worklet registrations are included in this bundle via webpack's dependency
// graph — user code on the MT layer is processed by worklet-loader-mt which
// extracts registerWorkletInternal() calls per-entry.
