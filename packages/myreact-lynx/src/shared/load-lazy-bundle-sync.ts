import { makeSyncThen } from "./make-sync-then.js";

/**
 * Synchronous lazy bundle resolution via `__QueryComponent`.
 * Used on the Main Thread (LEPUS) for first-screen `React.lazy()`.
 *
 * @internal
 */
export function loadLazyBundleSync<T>(source: string): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - __QueryComponent is a Lynx PAPI
  const query = __QueryComponent(source);
  let result: T;
  try {
    result = query.evalResult as T;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    // Return a never-resolving promise to avoid errors on first screen
    return new Promise(() => {});
  }
  const r: Promise<T> = Promise.resolve(result);
  r.then = makeSyncThen(result);
  return r;
}
