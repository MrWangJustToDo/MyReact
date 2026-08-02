/**
 * Main Thread (Lepus) bootstrap entry.
 *
 * Sets up:
 *   - globalThis.processData   – required by Lynx Lepus runtime (data processor)
 *   - globalThis.renderPage    – page root (id=1); IFR sync mount + seal when enabled
 *   - globalThis.updatePage    – no-op stub (required by Lynx Lepus runtime)
 *   - globalThis.reactPatchUpdate – BG ops; IFR hydrate via interceptPatchUpdate
 *   - globalThis.processEvalResult – processes lazy bundle exports
 *   - lynx.loadLazyBundle      – for chunk loading runtime (async bundles)
 *
 * IFR wiring: beginIfrSession → recordAndApply → sealIfrSnapshot → interceptPatchUpdate.
 * @see packages/myreact-lynx/IFR.md
 */

import "../shared/lynx-globals-polyfill.js";

import { registerLocalOpsApplier } from "../background/render/local-ops-applier.js";
import { isIfrEnabled } from "../shared/ifr.js";
import { getLynxWorkletImpl } from "../shared/lynx-worklet-impl.js";
import { parsePatchPayload, type DelayedRunOnMainThreadPayload } from "../shared/patch-payload.js";
import { onFirstScreenPatchFinished } from "../shared/worklet-bindings.js";

import { elements, setPageUniqueId } from "./element-registry.js";
import { resetFirstScreenPatchState, setFirstScreenPatch } from "./first-screen-flag.js";
import { beginIfrSession, interceptPatchUpdate, recordAndApply, resetIfrState, sealIfrSnapshot } from "./ifr.js";
import { loadLazyBundleOnMainThread } from "./load-lazy-bundle.js";
import { applyOps, resetMainThreadState } from "./ops-apply.js";
import { runOnBackground } from "./run-on-background.js";

/** Fallback for legacy bare-array patch payloads. */
let legacyFirstScreenPatchPending = true;

/** Seed MainThreadRefs before ops / delayed worklets access them. */
function applyWorkletRefInitValues(patch: [number, unknown][] | undefined): void {
  if (!patch?.length) {
    return;
  }
  const update = getLynxWorkletImpl()?._refImpl?.updateWorkletRefInitValueChanges;
  if (update) {
    update(patch);
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

  const impl = getLynxWorkletImpl();
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
    runTask(data.worklet as never, data.params as never, data.resolveId);
  }
}

// Register processEvalResult for lazy bundle loading.
// When a lazy bundle is loaded, the web simulator calls:
//   processEvalResult(bundleExports, bundleUrl)
// The bundleExports is a function: (globDynamicComponentEntry) => module.exports
// We call it with the bundleUrl to match ReactLynx's behavior.
if (typeof globalThis.processEvalResult === "undefined") {
  globalThis.processEvalResult = function <T>(result: T | undefined, schema: string): T | undefined {
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
globalThis.__BACKGROUND_RUNTIME__ = false;
globalThis.__MAIN_THREAD_RUNTIME__ = true;

// Match official ReactLynx setupLynxEnv: host injects lynx.SystemInfo
// (including lynxSdkVersion). worklet-runtime gates rAF on SDK > 2.15 — if the
// host omits the field it defaults to "1.0" and rAF throws; do not hardcode a
// fake version here.
// Host declares `var SystemInfo`; only overwrite when Lynx injected a value.
if (typeof lynx !== "undefined" && lynx.SystemInfo) {
  SystemInfo = lynx.SystemInfo;
}

// Register runOnBackground as a global — extracted LEPUS worklet code calls it
// as a bare identifier (the SWC transform generates `runOnBackground(_jsFnK)`).
globalThis.runOnBackground = runOnBackground;

// The worklet-runtime (from @lynx-js/react) is bundled into this
// main-thread entry by the myreact-lynx plugin — it provides:
//   globalThis.runWorklet, globalThis.registerWorkletInternal,
//   globalThis.lynxWorkletImpl (with Element class, Animation, etc.)

/** PAGE_ROOT_ID must match the value in background/render/shadow-element.ts */
const PAGE_ROOT_ID = 1;

// Lynx Lepus runtime requires globalThis.processData to be set.
// It is called to transform initial data before renderPage runs.
// Data processors are registered via registerDataProcessors() on the BG thread.
globalThis.processData = function (data: unknown, _processorName?: string): unknown {
  return data ?? {};
};

// Lynx calls renderPage on the Main Thread first (before Background JS runs).
// We create the root page element and store it as id=1 so Background ops that
// target the root can resolve it correctly.
// When IFR is enabled, sync-mount the app here (Vue-style true mount) before BG.
globalThis.renderPage = function (_data: unknown): void {
  // Clear all element state from the previous page. This is essential for:
  // 1. Testing: prevents duplicate batch detection from skipping ops
  //    when ShadowElement IDs restart from 2 between test renders.
  // 2. Hot reload: ensures stale element handles don't persist.
  resetMainThreadState();
  resetFirstScreenPatchState();
  resetIfrState();
  legacyFirstScreenPatchPending = true;
  const page = __CreatePage("0", 0);
  // Set global CSS scope on page so its style_sheet_manager_ is populated.
  // This matches ReactLynx 3.0's root snapshot: __SetCSSId([__page], 0).
  __SetCSSId([page], 0);
  setPageUniqueId(__GetElementUniqueID(page));
  elements.set(PAGE_ROOT_ID, page);

  if (isIfrEnabled()) {
    // Registered by background/render/renderer.js when the app module loads on MT.
    const runIfr = globalThis.__MY_REACT_LYNX_RUN_IFR_RENDER__;
    if (typeof runIfr === "function") {
      beginIfrSession();
      registerLocalOpsApplier(recordAndApply);
      try {
        const mounted = runIfr();
        if (mounted) {
          sealIfrSnapshot();
          if (__DEV__) {
            console.log("[@my-react/react-lynx][IFR] Main Thread sync mount sealed — awaiting BG hydrate");
          }
        } else {
          resetIfrState();
        }
      } finally {
        registerLocalOpsApplier(null);
      }
    } else if (__DEV__) {
      console.warn(
        "[@my-react/react-lynx] enableIFR is on but no pending root.render was registered on Main Thread. " +
          "Call root.render() at module scope so renderPage can sync-mount."
      );
    }
  }

  __FlushElementTree(page);
};

// Lynx may call updatePage / updateGlobalProps after data changes.
// MyReact handles data updates on the Background Thread, so these are no-ops.
globalThis.updatePage = function (_data: unknown): void {
  // no-op: MyReact handles data updates on Background Thread
};

globalThis.updateGlobalProps = function (_data: unknown): void {
  // no-op
};

// Called by the BG Thread via callLepusMethod('reactPatchUpdate', { data }).
globalThis.reactPatchUpdate = function ({ data }: { data: string }): void {
  const payload = parsePatchPayload(data);
  const isFirstScreen = payload.isFirstScreen ?? legacyFirstScreenPatchPending;
  const endFirstScreen = payload.endFirstScreen ?? false;

  // 1) Seed MainThreadRefs  2) apply element ops  3) delayed runOnMainThread
  applyWorkletRefInitValues(payload.workletRefInitValues);

  // Vue-style IFR hydrate: compare BG ops to recorded MT first-screen stream.
  // Wrap with first-screen flag so value/worklet patches inside intercept see it.
  let hydrated = false;
  if (isIfrEnabled()) {
    if (isFirstScreen) {
      setFirstScreenPatch(true);
      try {
        hydrated = interceptPatchUpdate(payload.ops);
      } finally {
        setFirstScreenPatch(false);
      }
    } else {
      hydrated = interceptPatchUpdate(payload.ops);
    }
  }

  if (!hydrated) {
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
globalThis.updateMTRefInitValue = function ({ data }: { data: string }): void {
  applyWorkletRefInitValues(JSON.parse(data) as [id: number, value: unknown][]);
};

// Worklet registrations are included in this bundle via webpack's dependency
// graph — user code on the MT layer is processed by worklet-loader-mt which
// extracts registerWorkletInternal() calls per-entry.
