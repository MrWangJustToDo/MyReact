/**
 * MainThreadRef - A ref that can only be accessed on the main thread.
 *
 * On the Main Thread (inside a worklet function), `.current` resolves to the
 * actual PAPI element or state via the worklet-runtime's ref implementation.
 * `.current` is read-write on MT (worklet-runtime owns the value).
 *
 * The `_wvid` (worklet value id) bridges the two threads: the Background
 * Thread serializes it in the ops buffer, and the Main Thread's worklet-runtime
 * uses it to look up the real element handle in `lynxWorkletImpl._refImpl`.
 */

import { useMemo } from "@my-react/react";

import { addWorkletRefInitValue } from "./worklet-ref-pool.js";

let lastIdBG = 0;

/**
 * A `MainThreadRef` is a ref that can only be accessed on the main thread.
 * It is used to preserve states between main thread function calls.
 * The data saved in `current` property of the `MainThreadRef` can be read
 * and written in multiple main thread functions.
 *
 * @public
 */
export class MainThreadRef<T = unknown> {
  /**
   * Worklet value id — used by the Main Thread worklet runtime to resolve.
   * @internal
   */
  readonly _wvid: number;

  /**
   * @internal
   */
  protected _initValue: T;

  /**
   * @internal
   */
  protected _type: string;

  /**
   * Destruction observer for cleanup when the ref is garbage collected.
   * @internal
   */
  private _lifecycleObserver: unknown;

  constructor(initValue: T) {
    this._initValue = initValue;
    this._type = "main-thread";
    this._wvid = ++lastIdBG;

    addWorkletRefInitValue(this._wvid, initValue);

    // Create destruction observer to notify main thread when ref is GC'd
    const id = this._wvid;
    this._lifecycleObserver = lynx?.getNativeApp?.()?.createJSObjectDestructionObserver?.(() => {
      lynx?.getCoreContext?.()?.dispatchEvent({
        type: "Lynx.Worklet.releaseWorkletRef",
        data: { id },
      });
    });
  }

  /**
   * `.current` — the value of this ref.
   *
   * On the Background Thread, accessing this throws an error in dev mode.
   * On the Main Thread (inside worklet functions), this returns the actual value.
   */
  get current(): T {
    if (__DEV__) {
      console.warn(
        "[@my-react/react-lynx] MainThreadRef.current cannot be accessed on the Background Thread. " + "Access it inside 'main thread' functions only."
      );
    }
    return undefined as T;
  }

  set current(_: T) {
    if (__DEV__) {
      console.warn("[@my-react/react-lynx] MainThreadRef.current cannot be set on the Background Thread. " + "Set it inside 'main thread' functions only.");
    }
  }

  /**
   * Serialize for cross-thread transfer (ops buffer JSON).
   * @internal
   */
  toJSON(): { _wvid: number } {
    return { _wvid: this._wvid };
  }
}

/**
 * Create a `MainThreadRef`.
 *
 * A `MainThreadRef` is a ref that can only be accessed on the main thread.
 * It is used to preserve states between main thread function calls.
 * The data saved in `current` property of the `MainThreadRef` can be read
 * and written in multiple main thread functions.
 *
 * This is a hook and should only be called at the top level of your component.
 *
 * @param initValue - The initial value of the `MainThreadRef`.
 *
 * @example
 * ```tsx
 * import { useMainThreadRef } from '@my-react/react-lynx'
 *
 * export function App() {
 *   const ref = useMainThreadRef<any>(null)
 *
 *   const handleTap = () => {
 *     'main thread'
 *     ref.current?.setStyleProperty('background-color', 'blue')
 *   }
 *
 *   return (
 *     <view
 *       main-thread-ref={ref}
 *       main-thread-bindtap={handleTap}
 *       style={{ width: 300, height: 300 }}
 *     />
 *   )
 * }
 * ```
 *
 * @public
 */
export function useMainThreadRef<T>(initValue: T): MainThreadRef<T>;

// Convenience overload for refs given as a ref prop (typically start with null)
export function useMainThreadRef<T>(initValue: T | null): MainThreadRef<T | null>;

// Convenience overload for potentially undefined initialValue / call with 0 arguments
export function useMainThreadRef<T = undefined>(): MainThreadRef<T | undefined>;

export function useMainThreadRef<T>(initValue?: T): MainThreadRef<T | undefined> {
  // Use useMemo with empty deps to ensure the ref is only created once per component
  return useMemo(() => {
    return new MainThreadRef(initValue);
  }, []);
}

/** Reset module state — for testing only. */
export function resetMainThreadRefState(): void {
  lastIdBG = 0;
}
