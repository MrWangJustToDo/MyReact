/**
 * Gesture helpers for the Background Thread reconciler.
 *
 * Serializes @lynx-js/gesture-runtime instances for cross-thread ops and
 * retains worklet callback contexts so they stay alive after JSON transfer.
 */

import { retainWorkletCtx } from "../shared/worklet-bindings.js";

const GESTURE_TYPE_COMPOSED = -1;

type SerializedGesture = Record<string, unknown> & {
  __isSerialized?: boolean;
  type?: number;
  gestures?: SerializedGesture[];
  callbacks?: Record<string, unknown>;
};

function isGestureKind(value: unknown): value is Record<string, unknown> & { __isGesture: true } {
  return !!value && typeof value === "object" && (value as Record<string, unknown>).__isGesture === true;
}

function appendSerializedBaseGestures(gesture: SerializedGesture | undefined, out: SerializedGesture[], seenIds: Set<number>): void {
  if (!gesture?.__isSerialized) {
    return;
  }

  if (gesture.type === GESTURE_TYPE_COMPOSED) {
    for (const sub of gesture.gestures ?? []) {
      appendSerializedBaseGestures(sub, out, seenIds);
    }
    return;
  }

  const id = gesture.id as number | undefined;
  if (id == null || seenIds.has(id)) {
    return;
  }
  seenIds.add(id);
  out.push(gesture);
}

/**
 * Prepare a gesture value from JSX for transmission to the Main Thread.
 *
 * @public
 * @internal
 */
export function serializeGestureForOp(value: unknown): SerializedGesture | null {
  if (value == null) {
    return null;
  }

  if (!isGestureKind(value)) {
    if (__DEV__) {
      console.warn("[@my-react/react-lynx] main-thread:gesture expects a Gesture instance from @lynx-js/gesture-runtime.");
    }
    return null;
  }

  if (typeof (value as unknown as { processPanDistance?: () => void }).processPanDistance === "function") {
    (value as unknown as { processPanDistance: () => void }).processPanDistance();
  }

  if (typeof (value as unknown as { serialize?: () => SerializedGesture }).serialize === "function") {
    return (value as unknown as { serialize: () => SerializedGesture }).serialize();
  }

  if ((value as SerializedGesture).__isSerialized) {
    return value as SerializedGesture;
  }

  return null;
}

/**
 * Retain worklet contexts referenced by gesture callbacks on the BG thread.
 */
export function retainGestureCallbacks(gesture: SerializedGesture | null | undefined): void {
  if (!gesture) {
    return;
  }

  const baseGestures: SerializedGesture[] = [];
  appendSerializedBaseGestures(gesture, baseGestures, new Set());

  for (const baseGesture of baseGestures) {
    const callbacks = baseGesture.callbacks;
    if (!callbacks) {
      continue;
    }
    for (const key of Object.keys(callbacks)) {
      const callback = callbacks[key];
      if (callback && typeof callback === "object") {
        retainWorkletCtx(callback as Parameters<typeof retainWorkletCtx>[0]);
      }
    }
  }
}
