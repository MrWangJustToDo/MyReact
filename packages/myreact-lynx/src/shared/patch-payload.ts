/**
 * BG→MT ops patch payload.
 *
 * Legacy format: bare `unknown[]` ops array (first-screen inferred on MT).
 */
export interface DelayedRunOnMainThreadPayload {
  worklet: Worklet;
  params: unknown[];
  resolveId: number;
}

export type WorkletRefInitValuePatch = [id: number, value: unknown][];

export interface PatchPayload {
  ops: unknown[];
  isFirstScreen?: boolean;
  endFirstScreen?: boolean;
  /**
   * MainThreadRef initial values for this patch. Applied on MT before ops and
   * delayed worklets so `useMotionValueRef` / `runOnMainThread` see seeded refs.
   */
  workletRefInitValues?: WorkletRefInitValuePatch;
  /** Worklets deferred until after this patch's ops/ref inits apply. */
  delayedRunOnMainThreadData?: DelayedRunOnMainThreadPayload[];
}

export function parsePatchPayload(data: string): PatchPayload {
  const parsed: unknown = JSON.parse(data);
  if (Array.isArray(parsed)) {
    return { ops: parsed };
  }
  const payload = parsed as PatchPayload;
  return {
    ops: Array.isArray(payload.ops) ? payload.ops : [],
    isFirstScreen: payload.isFirstScreen,
    endFirstScreen: payload.endFirstScreen,
    workletRefInitValues: Array.isArray(payload.workletRefInitValues) ? payload.workletRefInitValues : undefined,
    delayedRunOnMainThreadData: Array.isArray(payload.delayedRunOnMainThreadData) ? payload.delayedRunOnMainThreadData : undefined,
  };
}
