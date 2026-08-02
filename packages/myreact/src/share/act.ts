import { startTransition } from "./transition";

export function act(cb: () => void) {
  const abort = new AbortController();

  const promise = new Promise<void>(function actPromise(res) {
    if (abort.signal.aborted) {
      res();
      return;
    }

    const onAbort = function onAbort() {
      abort.signal.removeEventListener("abort", onAbort);
      res();
    };

    abort.signal.addEventListener("abort", onAbort);
  });

  const wrapperCB = async function actWrapper() {
    try {
      await cb();
    } finally {
      startTransition(function abortAct() {
        abort.abort();
      });
    }
  };

  startTransition(wrapperCB);

  return promise;
}
