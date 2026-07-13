/**
 * Background Thread first-screen patch phase tracking.
 *
 * MyReact does not use ReactLynx snapshot hydration. This module tracks when
 * BG→MT ops belong to the initial mount so worklet/gesture lifecycle hooks
 * can run deferred first-screen work on the Main Thread.
 */

let inFirstScreenPhase = true;
let sendEndMarker = false;

/** Whether subsequent flushes should be tagged as first-screen patches. */
export function isFirstScreenPatchPending(): boolean {
  return inFirstScreenPhase;
}

/**
 * Mark the end of the first-screen patch phase and schedule a terminal flush.
 * Called automatically after the first `render()` commit; apps with async lazy
 * boundaries on first screen may call this again manually when ready.
 *
 * @public
 */
export function markFirstScreenPatchComplete(): void {
  if (!inFirstScreenPhase) {
    return;
  }
  sendEndMarker = true;
}

/** Build metadata attached to the next BG→MT patch payload. */
export function buildFirstScreenPatchMeta(): { isFirstScreen: boolean; endFirstScreen: boolean } {
  if (sendEndMarker) {
    sendEndMarker = false;
    inFirstScreenPhase = false;
    return { isFirstScreen: true, endFirstScreen: true };
  }
  return { isFirstScreen: inFirstScreenPhase, endFirstScreen: false };
}

/** Reset — for testing / page reload coordination. */
export function resetFirstScreenPatchState(): void {
  inFirstScreenPhase = true;
  sendEndMarker = false;
}
