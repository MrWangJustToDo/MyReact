/**
 * Thin wrappers around worklet-runtime lifecycle hooks.
 *
 * Uses the host `lynxWorkletImpl` global (typed by `@lynx-js/react` worklet-runtime).
 */

import { getLynxWorkletImpl } from "./lynx-worklet-impl.js";

export type WorkletLike = {
  _execId?: number;
  _wkltId?: string;
};

export function retainWorkletCtx(worklet: WorkletLike): void {
  if (worklet._execId !== undefined) {
    getLynxWorkletImpl()?._jsFunctionLifecycleManager?.addRef(worklet._execId, worklet);
  }
}

export function onWorkletCtxUpdate(worklet: WorkletLike, oldWorklet: WorkletLike | null | undefined, isFirstScreen: boolean, element: LynxElement): void {
  const impl = getLynxWorkletImpl();

  if (isFirstScreen && oldWorklet && impl?._hydrateCtx) {
    // Host typings require Worklet; runtime only needs {_wkltId,_execId,…}.
    impl._hydrateCtx(worklet as never, oldWorklet as never);
  }
  if (isFirstScreen) {
    impl?._eventDelayImpl?.runDelayedWorklet(worklet as never, element as never);
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
  const impl = getLynxWorkletImpl();

  impl?._runOnBackgroundDelayImpl?.runDelayedBackgroundFunctions?.();
  impl?._refImpl?.clearFirstScreenWorkletRefMap?.();
  impl?._eventDelayImpl?.clearDelayedWorklets?.();
}

/**
 * Register MainThreadObject factory descriptors carried by a ref-init patch.
 * Must run on the main thread before `updateWorkletRefInitValueChanges`.
 *
 * @internal
 */
export function registerMainThreadObjectTypesFromPatch(
  patch: readonly ([number, unknown] | [number, unknown, string] | [number, unknown, string, unknown])[] | undefined
): void {
  if (!patch?.length) {
    return;
  }
  const register = getLynxWorkletImpl()?._refImpl?.registerMainThreadObjectType;
  if (!register) {
    return;
  }
  for (const entry of patch) {
    if (entry.length < 4) {
      continue;
    }
    const [, , type, create] = entry;
    if (type === undefined || typeof create !== "object" || create === null || !("_wkltId" in create)) {
      continue;
    }
    register(type, create as never);
  }
}
