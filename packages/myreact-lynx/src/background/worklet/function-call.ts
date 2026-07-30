/**
 * Function-call return value resolver for runOnMainThread.
 *
 * When the Background Thread dispatches a worklet call via
 * 'Lynx.Worklet.runWorkletCtx', the Main Thread executes the worklet and
 * sends the return value back via 'Lynx.Worklet.FunctionCallRet'.
 * This module listens for that event and resolves the corresponding Promise.
 */

import type { RunWorkletCtxRetData } from "@lynx-js/react/worklet-runtime/bindings";

const FUNCTION_CALL_RET = "Lynx.Worklet.FunctionCallRet";

let resolveMap: Map<number, (value: unknown) => void> | undefined;
let nextResolveId = 1;

function initReturnValueListener(): void {
  resolveMap = new Map();
  lynx.getCoreContext().addEventListener(FUNCTION_CALL_RET, onFunctionCallRet);
}

function onFunctionCallRet(event: { data?: unknown }): void {
  const data = JSON.parse(event.data as string) as RunWorkletCtxRetData;
  const resolve = resolveMap!.get(data.resolveId);
  if (resolve) {
    resolveMap!.delete(data.resolveId);
    resolve(data.returnValue);
  }
}

/**
 * Register a resolve callback and return its unique ID.
 * The ID is sent to the Main Thread so it can match the return value.
 */
export function onFunctionCall(resolve: (value: unknown) => void): number {
  if (!resolveMap) {
    initReturnValueListener();
  }
  const id = nextResolveId++;
  resolveMap!.set(id, resolve);
  return id;
}

/**
 * Register a resolve/reject callback pair with an optional timeout.
 * If the timeout expires before the MT responds, the reject callback is called.
 * This helps detect stale worklet registrations after HMR.
 */
export function onFunctionCallWithTimeout(resolve: (value: unknown) => void, reject: (error: Error) => void, timeoutMs: number): number {
  if (!resolveMap) {
    initReturnValueListener();
  }
  const id = nextResolveId++;

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const wrappedResolve = (value: unknown) => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    resolve(value);
  };

  resolveMap!.set(id, wrappedResolve);

  if (timeoutMs > 0) {
    timeoutHandle = setTimeout(() => {
      if (resolveMap?.has(id)) {
        resolveMap.delete(id);
        reject(
          new Error(
            "[@my-react/react-lynx] runOnMainThread timed out waiting for response. " +
              "This usually happens after HMR when worklet registrations become stale. " +
              "Try refreshing the page to re-register all worklets."
          )
        );
      }
    }, timeoutMs);
  }

  return id;
}

/** Reset module state — for testing only. */
export function resetFunctionCallState(): void {
  resolveMap = undefined;
  nextResolveId = 1;
}
