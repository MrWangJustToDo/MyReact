/**
 * Worklet ref pool - manages initial values for MainThreadRefs.
 *
 * When a MainThreadRef is created on the Background Thread, its initial value
 * is stored here. The values are sent to the Main Thread in batches during
 * the flush cycle so the worklet-runtime can initialize the refs.
 */

export type WorkletRefInitValuePatch = (
  | [id: number, value: unknown]
  | [id: number, value: unknown, type: string]
  | [id: number, value: unknown, type: string, create: unknown]
)[];

let initValuePatch: WorkletRefInitValuePatch = [];

/**
 * Add a worklet ref's initial value to the pending patch.
 * Called when a new MainThreadRef is created.
 * @internal
 */
export function addWorkletRefInitValue(id: number, value: unknown, type?: string, create?: unknown): void {
  if (type === undefined) {
    initValuePatch.push([id, value]);
  } else if (create === undefined) {
    initValuePatch.push([id, value, type]);
  } else {
    initValuePatch.push([id, value, type, create]);
  }
}

/**
 * Take and clear all pending worklet ref init values.
 * Called during flush to send to the Main Thread.
 * @internal
 */
export function takeWorkletRefInitValuePatch(): WorkletRefInitValuePatch {
  const res = initValuePatch;
  initValuePatch = [];
  return res;
}

/** @internal */
export function hasPendingWorkletRefInits(): boolean {
  return initValuePatch.length > 0;
}

/**
 * Reset the pool state - for testing only.
 * @internal
 */
export function resetWorkletRefPool(): void {
  initValuePatch = [];
}
