/**
 * Thin wrappers around worklet-runtime lifecycle hooks.
 *
 * Avoids importing from `@lynx-js/react/worklet-runtime/bindings` which may
 * differ across published @lynx-js/react versions.
 */

export type WorkletLike = {
  _execId?: number;
  _wkltId?: string;
};

export function retainWorkletCtx(worklet: WorkletLike): void {
  if (worklet._execId !== undefined) {
    const impl = (globalThis as Record<string, unknown>)["lynxWorkletImpl"] as
      | { _jsFunctionLifecycleManager?: { addRef: (id: number, ctx: unknown) => void } }
      | undefined;
    impl?._jsFunctionLifecycleManager?.addRef(worklet._execId, worklet);
  }
}

export function onWorkletCtxUpdate(worklet: WorkletLike, oldWorklet: WorkletLike | null | undefined, isFirstScreen: boolean, element: LynxElement): void {
  const impl = (globalThis as Record<string, unknown>)["lynxWorkletImpl"] as
    | {
        _hydrateCtx?: (next: WorkletLike, prev: WorkletLike) => void;
        _eventDelayImpl?: { runDelayedWorklet: (w: WorkletLike, el: LynxElement) => void };
      }
    | undefined;

  if (isFirstScreen && oldWorklet) {
    impl?._hydrateCtx?.(worklet, oldWorklet);
  }
  if (isFirstScreen) {
    impl?._eventDelayImpl?.runDelayedWorklet(worklet, element);
  }
}

/**
 * Flush deferred first-screen worklet / ref state after the initial mount
 * patch phase ends. Mirrors `@lynx-js/react/worklet-runtime/bindings`
 * `onHydrationFinished` without importing the prebuilt module.
 *
 * @internal
 */
export function onFirstScreenPatchFinished(): void {
  const impl = (globalThis as Record<string, unknown>)["lynxWorkletImpl"] as
    | {
        _runOnBackgroundDelayImpl?: { runDelayedBackgroundFunctions?: () => void };
        _refImpl?: { clearFirstScreenWorkletRefMap?: () => void };
        _eventDelayImpl?: { clearDelayedWorklets?: () => void };
      }
    | undefined;

  impl?._runOnBackgroundDelayImpl?.runDelayedBackgroundFunctions?.();
  impl?._refImpl?.clearFirstScreenWorkletRefMap?.();
  impl?._eventDelayImpl?.clearDelayedWorklets?.();
}
