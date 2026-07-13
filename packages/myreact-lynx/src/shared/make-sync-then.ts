/**
 * Create a sync-like `then` for first-screen lazy bundle resolution.
 * Webpack chunk loading calls `lynx.loadLazyBundle().then(...)` synchronously on MT.
 *
 * @internal
 */
export const makeSyncThen = function <T>(result: T): Promise<T>["then"] {
  return function <TR1 = T, TR2 = never>(
    this: Promise<T>,
    onF?: ((value: T) => TR1 | PromiseLike<TR1>) | null,
    _onR?: ((reason: unknown) => TR2 | PromiseLike<TR2>) | null
  ): Promise<TR1 | TR2> {
    if (onF) {
      let ret: TR1 | PromiseLike<TR1>;
      try {
        ret = onF(result);
      } catch (e) {
        return Promise.reject(e as Error);
      }

      if (ret && typeof (ret as PromiseLike<TR1>).then === "function") {
        return ret as Promise<TR1>;
      }

      const p = Promise.resolve(ret);
      const then = makeSyncThen(ret as TR1);
      p.then = then as Promise<Awaited<TR1>>["then"];
      return p as Promise<TR1 | TR2>;
    }

    return this as Promise<TR1 | TR2>;
  };
};
