import { __my_react_scheduler__ } from "@my-react/react/type";

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

/**
 * Send worklet ref init values to the main thread.
 * This must be called before the ops flush so the main thread has
 * the ref values available when worklet functions try to access them.
 */
function sendWorkletRefInitValues(): void {
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

  // Send worklet ref init values first
  sendWorkletRefInitValues();

  const ops = takeOps();
  const { isFirstScreen, endFirstScreen } = buildFirstScreenPatchMeta();

  if (ops.length === 0 && !endFirstScreen) {
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
};
