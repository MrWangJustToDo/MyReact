/**
 * Transform a BG-side function into a JsFnHandle for cross-thread dispatch.
 *
 * The SWC JS pass generates `transformToWorklet(fn)` calls — this wraps the
 * function with a unique `_jsFnId` so the MT side can reference it when
 * calling `runOnBackground`.
 */

import type { JsFnHandle } from "@lynx-js/react/worklet-runtime/bindings";

let lastId = 0;

export function transformToWorklet(obj: (...args: unknown[]) => unknown): JsFnHandle {
  const id = ++lastId;
  if (typeof obj !== "function") {
    return {
      _jsFnId: id,
      _error: `Argument of runOnBackground should be a function, got [${typeof obj}]`,
    };
  }
  (obj as unknown as { toJSON?: () => string }).toJSON ??= () => "[BackgroundFunction]";
  return { _jsFnId: id, _fn: obj };
}

/** Reset module state — for testing only. */
export function resetTransformToWorkletState(): void {
  lastId = 0;
}
