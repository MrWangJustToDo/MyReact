import { startTransition } from "./transition";

export const act = (cb: () => void) => {
  const abort = new AbortController();

  const promise = new Promise<void>((res) => {
    if (abort.signal.aborted) {
      res();
      return;
    }

    const onAbort = () => {
      abort.signal.removeEventListener("abort", onAbort);
      res();
    };

    abort.signal.addEventListener("abort", onAbort);
  });

  const wrapperCB = async () => {
    try {
      await cb();
    } finally {
      startTransition(() => abort.abort());
    }
  };

  startTransition(wrapperCB);

  return promise;
};
