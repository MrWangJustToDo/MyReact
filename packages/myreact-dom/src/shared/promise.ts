export const createControlPromise = <T = void>() => {
  let resolve: (value: T) => void;
  let reject: (reason: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
};
