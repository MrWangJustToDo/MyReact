/**
 * Queue for `runOnMainThread` calls that must wait until the next MT patch.
 *
 * Mirrors official ReactLynx: worklets invoked during render (e.g.
 * `useMotionValueRef`) are not dispatched via core-context immediately.
 * They ride along with the ops flush so MainThreadRefs exist before the
 * worklet body reads `ref.current`.
 */

export type DelayedRunOnMainThreadData = {
  worklet: Worklet;
  params: unknown[];
  resolveId: number;
};

let delayedRunOnMainThreadData: DelayedRunOnMainThreadData[] = [];

/** @internal */
export function enqueueDelayedRunOnMainThread(data: DelayedRunOnMainThreadData): void {
  delayedRunOnMainThreadData.push(data);
}

/** @internal */
export function takeDelayedRunOnMainThreadData(): DelayedRunOnMainThreadData[] {
  const data = delayedRunOnMainThreadData;
  delayedRunOnMainThreadData = [];
  return data;
}

/** @internal */
export function hasDelayedRunOnMainThread(): boolean {
  return delayedRunOnMainThreadData.length > 0;
}

/** @internal */
export function resetDelayedRunOnMainThread(): void {
  delayedRunOnMainThreadData = [];
}
