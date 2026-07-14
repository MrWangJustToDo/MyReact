/**
 * Global `queueMicrotask` for third-party libraries (e.g. `@lynx-js/motion`).
 *
 * Official ReactLynx schedules via `lynxQueueMicrotask` (wraps `lynx.queueMicrotask`
 * without assigning it to `globalThis`). Motion's shim may set
 * `globalThis.queueMicrotask = lynx.queueMicrotask`, which breaks MyReact because
 * `@my-react/react` uses `queueMicrotask.bind(globalThis)` and loses host `this`
 * (`this.getNativeLynx is not a function`).
 *
 * Split of responsibilities:
 * - Here: Promise-based `globalThis.queueMicrotask` when missing (library-safe)
 * - `install-lynx-scheduler.ts`: framework `microTask` via `lynx.queueMicrotask`
 */

type MicrotaskFn = (callback: () => void) => void;

/** Install a Promise-based `globalThis.queueMicrotask` when missing. */
export function ensureQueueMicrotask(): void {
  const g = globalThis as typeof globalThis & { queueMicrotask?: MicrotaskFn };
  if (typeof g.queueMicrotask === "function") {
    return;
  }

  const resolved = Promise.resolve();
  g.queueMicrotask = (fn: () => void) => {
    resolved.then(fn).catch((err: unknown) => {
      setTimeout(() => {
        throw err;
      }, 0);
    });
  };
}

ensureQueueMicrotask();
