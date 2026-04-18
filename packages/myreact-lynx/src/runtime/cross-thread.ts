/**
 * Cross-thread invocation: dispatch a worklet function call to the Main Thread
 * and receive its return value as a Promise.
 *
 * The SWC worklet transform (Phase 2) replaces the function body with a
 * worklet context object (`{ _wkltId, _c }`) at build time. At runtime,
 * `runOnMainThread` dispatches the context to the Main Thread via
 * 'Lynx.Worklet.runWorkletCtx', where the worklet-runtime executes it.
 */

import { onFunctionCall, onFunctionCallWithTimeout } from "./function-call.js";
import { registerWorkletCtx } from "./run-on-background.js";

const RUN_WORKLET_CTX = "Lynx.Worklet.runWorkletCtx";

/** Timeout for worklet calls in development (ms). Set to 0 to disable. */
const DEV_WORKLET_TIMEOUT = __DEV__ ? 5000 : 0;

/** Track if we've shown the HMR warning */
let hmrWarningShown = false;

/**
 * Mark a function to be executed on the Main Thread.
 *
 * Returns a wrapper that, when called from the Background Thread, dispatches
 * the call to the Main Thread via the worklet runtime and returns a Promise
 * that resolves to the function's return value.
 *
 * The SWC worklet transform replaces the `fn` argument with a worklet context
 * object at build time. Without the transform, `fn` is passed through as-is
 * (dev warning in non-production builds).
 *
 * @example
 * ```ts
 * const animate = runOnMainThread((x: number) => {
 *   'main thread'
 *   element.setStyleProperty('opacity', String(x))
 * })
 * await animate(0.5) // executes on Main Thread
 * ```
 */
export function runOnMainThread<R, Fn extends (...args: unknown[]) => R>(fn: Fn): (...args: Parameters<Fn>) => Promise<R> {
  const worklet = fn as unknown as Worklet;

  // Validate worklet context structure
  if (__DEV__) {
    if (typeof fn === "function" && !("_wkltId" in (fn as unknown as Record<string, unknown>))) {
      console.warn(
        "[@my-react/react-lynx] runOnMainThread received a plain function instead of a worklet context. " +
          "Make sure the function contains 'main thread' directive and the worklet transform is enabled."
      );
    }

    // Show HMR warning once per session
    if (__HMR__ && !hmrWarningShown) {
      hmrWarningShown = true;
      console.info(
        "[@my-react/react-lynx] Note: Hot Module Replacement (HMR) does not fully support 'main thread' worklets. " +
          "If worklets stop working after code changes, please refresh the page."
      );
    }
  }

  registerWorkletCtx(worklet);

  return async (...params: Parameters<Fn>): Promise<R> => {
    return new Promise((resolve, reject) => {
      // Validate worklet is still registered (may become stale after HMR)
      if (__DEV__) {
        const ctx = worklet as unknown as Record<string, unknown>;
        if (!ctx._wkltId) {
          reject(new Error("[@my-react/react-lynx] Invalid worklet context: missing _wkltId. " + "This may happen after HMR - try refreshing the page."));
          return;
        }
      }

      // Use timeout in development to detect stale worklet registrations
      const resolveId =
        DEV_WORKLET_TIMEOUT > 0
          ? onFunctionCallWithTimeout(resolve as (value: unknown) => void, reject, DEV_WORKLET_TIMEOUT)
          : onFunctionCall(resolve as (value: unknown) => void);

      lynx.getCoreContext().dispatchEvent({
        type: RUN_WORKLET_CTX,
        data: JSON.stringify({
          worklet,
          params,
          resolveId,
        }),
      });
    });
  };
}
