/**
 * Worklet ref pool - manages initial values for MainThreadRefs.
 *
 * When a MainThreadRef is created on the Background Thread, its initial value
 * is stored here. The values are sent to the Main Thread in batches during
 * the flush cycle so the worklet-runtime can initialize the refs.
 */

export type WorkletRefInitValuePatch = [id: number, value: unknown][];

let initValuePatch: WorkletRefInitValuePatch = [];

/**
 * Add a worklet ref's initial value to the pending patch.
 * Called when a new MainThreadRef is created.
 * @internal
 */
export function addWorkletRefInitValue(id: number, value: unknown): void {
  initValuePatch.push([id, value]);
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

/**
 * Reset the pool state - for testing only.
 * @internal
 */
export function resetWorkletRefPool(): void {
  initValuePatch = [];
}
