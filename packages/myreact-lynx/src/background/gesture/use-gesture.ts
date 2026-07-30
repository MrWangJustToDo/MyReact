/**
 * useGesture — MyReact-compatible wrapper around @lynx-js/gesture-runtime.
 *
 * The upstream hook imports `useRef` from `@lynx-js/react`, which would
 * create a circular dependency when `@lynx-js/react` is aliased to
 * `@my-react/react-lynx`. This wrapper uses `@my-react/react` instead.
 */

import { useRef } from "@my-react/react";

import type { DefaultScrollGesture, FlingGesture, LongPressGesture, NativeGesture, PanGesture, TapGesture } from "@lynx-js/gesture-runtime";

type IBasicGestures = PanGesture | FlingGesture | DefaultScrollGesture | TapGesture | LongPressGesture | NativeGesture;

/**
 * Create and retain a gesture instance across re-renders.
 * Clones the gesture when its `execId` changes (e.g. after config updates).
 *
 * @public
 */
export function useGesture<T extends IBasicGestures>(GestureConstructor: new () => T): T {
  const gestureRef = useRef<T>(new GestureConstructor());
  const lastExecIdRef = useRef(gestureRef.current.execId);

  if (lastExecIdRef.current !== gestureRef.current.execId) {
    lastExecIdRef.current = gestureRef.current.execId;
    const cloned = gestureRef.current.clone() as T;
    gestureRef.current = cloned;
  }

  return gestureRef.current;
}
