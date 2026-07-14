import { __my_react_scheduler__ } from "@my-react/react/type";

import { resetDelayedRunOnMainThread, takeDelayedRunOnMainThreadData } from "./delayed-run-on-main-thread.js";
import { buildFirstScreenPatchMeta } from "./first-screen-patch.js";
import { takeOps } from "./ops.js";
import { takeWorkletRefInitValuePatch } from "./worklet-ref-pool.js";

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
  scheduled = true;
  __my_react_scheduler__.microTask(() => doFlush());
};

export const resetFlushState = () => {
  scheduled = false;
  pendingAckResolve = null;
  pendingAckPromise = null;
  resetDelayedRunOnMainThread();
};
