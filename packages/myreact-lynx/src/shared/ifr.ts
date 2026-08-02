/**
 * Instant First-Frame Rendering (IFR) helpers.
 *
 * IFR ≠ first-screen patch meta (`isFirstScreen` / `endFirstScreen`).
 * Those mark BG→MT worklet hydrate / handoff. IFR means Main Thread sync
 * mount inside `renderPage` before Background starts.
 *
 * Id stability: both threads use `ShadowElement.nextId` starting at 2 after
 * page root id=1. First screen must be deterministic and the same on MT + BG
 * (route/data). MT records the ops stream; BG batches hydrate against it
 * (identical skip / value patch / structural teardown fallback).
 *
 * @see packages/myreact-lynx/IFR.md — sequence, file map, debug checklist
 */

/** Compile-time: plugin `enableIFR: true`. */
export function isIfrEnabled(): boolean {
  return typeof __MY_REACT_LYNX_IFR__ !== "undefined" && !!__MY_REACT_LYNX_IFR__;
}

/**
 * True while running the IFR Main Thread sync mount path.
 * Use to skip network / impure side effects during `renderPage` mount.
 *
 * @public
 */
export function isIfrMainThread(): boolean {
  if (!isIfrEnabled()) {
    return false;
  }
  if (typeof __MAIN_THREAD__ !== "undefined") {
    return !!__MAIN_THREAD__;
  }
  return !!globalThis.__MAIN_THREAD_RUNTIME__;
}
