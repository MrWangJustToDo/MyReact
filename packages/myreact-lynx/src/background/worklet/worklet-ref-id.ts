/**
 * Shared worklet value id allocator.
 *
 * `MainThreadRef` and typed `MainThreadObject` handles must draw from the same
 * monotonically increasing sequence: the worklet runtime stores both kinds in
 * one `_workletRefMap` keyed by `_wvid`.
 *
 * @internal
 */

let lastIdBG = 0;

/** Allocate the next background-thread worklet value id. @internal */
export function allocateWorkletRefId(): number {
  lastIdBG += 1;
  return lastIdBG;
}

/** Reset the allocator — for testing only. @internal */
export function resetWorkletRefIdState(): void {
  lastIdBG = 0;
}
