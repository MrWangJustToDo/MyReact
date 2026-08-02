/**
 * Ops / ref-init / delayed-worklet flush to Main Thread.
 *
 * Paths:
 * - IFR sync mount: `localOpsApplier` set → sync doFlush (ref → ops → delayed), no Lepus RPC.
 * - After IFR seal on MT: `__MY_REACT_LYNX_IFR_DROP_MT_OPS__` drains and drops.
 * - Normal BG: microtask → callLepusMethod('reactPatchUpdate').
 *
 * @see packages/myreact-lynx/IFR.md §3
 */

import { __my_react_scheduler__ } from "@my-react/react/type";

import { getLynxWorkletImpl } from "../../shared/lynx-worklet-impl.js";
import { buildFirstScreenPatchMeta, markFirstScreenPatchComplete } from "../first-screen/first-screen-patch.js";
import { resetDelayedRunOnMainThread, takeDelayedRunOnMainThreadData } from "../worklet/delayed-run-on-main-thread.js";
import { takeWorkletRefInitValuePatch } from "../worklet/worklet-ref-pool.js";

import { getLocalOpsApplier } from "./local-ops-applier.js";
import { takeOps } from "./ops.js";

let scheduled = false;
let pendingAckResolve: (() => void) | null = null;
let pendingAckPromise: Promise<void> | null = null;

/**
 * Returns a promise that resolves once the most recent ops batch has been
 * applied on the main thread. If no ops are in flight, resolves immediately.
 */
export function waitForFlush(): Promise<void> {
  return pendingAckPromise ?? Promise.resolve();
}

/** @internal */
export function isFlushScheduled(): boolean {
  return scheduled;
}

/** @internal */
export function hasPendingFlushAck(): boolean {
  return pendingAckPromise != null;
}

/**
 * Send leftover worklet ref init values to the main thread (standalone path).
 * Prefer in-patch `workletRefInitValues` during `doFlush` for ordering with
 * delayed `runOnMainThread` calls.
 */
export function sendWorkletRefInitValues(): void {
  const patch = takeWorkletRefInitValuePatch();
  if (patch.length === 0) {
    return;
  }

  const app = lynx?.getNativeApp?.();
  if (!app) {
    return;
  }

  const data = JSON.stringify(patch);
  app.callLepusMethod("updateMTRefInitValue", { data });
}

const doFlush = () => {
  scheduled = false;

  // Take ref inits into the SAME patch as ops + delayed worklets so MT
  // applies them in order (separate callLepusMethod can race).
  const workletRefInitValues = takeWorkletRefInitValuePatch();
  const ops = takeOps();
  const delayedRunOnMainThreadData = takeDelayedRunOnMainThreadData();
  const { isFirstScreen, endFirstScreen } = buildFirstScreenPatchMeta();

  if (ops.length === 0 && !endFirstScreen && delayedRunOnMainThreadData.length === 0 && workletRefInitValues.length === 0) {
    return;
  }

  const resolvePendingAck = () => {
    pendingAckResolve?.();
    pendingAckResolve = null;
    pendingAckPromise = null;
  };

  // After IFR snapshot is sealed on MT, drop further MT reconciler ops (Suspense, etc.).
  if (typeof __MAIN_THREAD__ !== "undefined" && __MAIN_THREAD__ && globalThis.__MY_REACT_LYNX_IFR_DROP_MT_OPS__) {
    resolvePendingAck();
    return;
  }

  // IFR Main Thread sync mount: apply locally (no callLepusMethod round-trip).
  // Must mirror reactPatchUpdate ordering: ref init → ops → delayed runOnMainThread.
  const localApply = getLocalOpsApplier();
  if (localApply) {
    const workletImpl = getLynxWorkletImpl();
    if (workletRefInitValues.length > 0) {
      workletImpl?._refImpl?.updateWorkletRefInitValueChanges?.(workletRefInitValues);
    }
    if (ops.length > 0) {
      localApply(ops);
    }
    if (delayedRunOnMainThreadData.length > 0) {
      const runTask = workletImpl?._runRunOnMainThreadTask;
      if (runTask) {
        for (const data of delayedRunOnMainThreadData) {
          runTask(data.worklet as never, data.params as never, data.resolveId);
        }
      }
    }
    resolvePendingAck();
    return;
  }

  pendingAckPromise = new Promise<void>((resolve) => {
    pendingAckResolve = resolve;
  });

  const app = lynx?.getNativeApp?.();
  const method = globalThis.__MY_REACT_LYNX_PATCH_METHOD__ || "reactPatchUpdate";

  if (!app?.callLepusMethod) {
    if (__DEV__) {
      console.warn("[@my-react/react-lynx] callLepusMethod is unavailable; skipping main-thread patch flush.");
    }
    resolvePendingAck();
    return;
  }

  app.callLepusMethod(
    method,
    {
      data: JSON.stringify({
        ops,
        isFirstScreen,
        endFirstScreen,
        workletRefInitValues: workletRefInitValues.length > 0 ? workletRefInitValues : undefined,
        delayedRunOnMainThreadData: delayedRunOnMainThreadData.length > 0 ? delayedRunOnMainThreadData : undefined,
      }),
    },
    () => {
      resolvePendingAck();
    }
  );
};

export const scheduleFlush = () => {
  if (scheduled) {
    return;
  }
  // IFR sync mount must paint inside renderPage — do not defer to microtask.
  if (getLocalOpsApplier()) {
    doFlush();
    return;
  }
  scheduled = true;
  __my_react_scheduler__.microTask(() => doFlush());
};

/**
 * Force an immediate ops flush (IFR sync path). No-op if nothing pending.
 * @internal
 */
export function flushSyncNow(): void {
  if (scheduled) {
    doFlush();
    return;
  }
  doFlush();
}

/**
 * Schedule the terminal first-screen patch flush after the initial commit.
 * Uses a microtask so synchronous lazy boundaries in the same commit wave
 * still emit first-screen tagged patches.
 */
export function scheduleFirstScreenPatchEnd(): void {
  __my_react_scheduler__.microTask(() => {
    markFirstScreenPatchComplete();
    scheduleFlush();
  });
}

export const resetFlushState = () => {
  scheduled = false;
  pendingAckResolve = null;
  pendingAckPromise = null;
  resetDelayedRunOnMainThread();
};
