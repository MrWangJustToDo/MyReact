/**
 * Override MyReact's `currentScheduler.microTask` for the Lynx host.
 *
 * Lynx exposes scheduling via `lynx.queueMicrotask`. Installing that function
 * onto `globalThis.queueMicrotask` (or using `queueMicrotask.bind(globalThis)`)
 * breaks host methods that expect `this` to be the lynx object
 * (`this.getNativeLynx is not a function`).
 *
 * So we patch the scheduler API inside `@my-react/react-lynx` instead of
 * changing `@my-react/react`.
 */

import { __my_react_internal__, __my_react_scheduler__ } from "@my-react/react/type";

function lynxMicroTask(task: () => void): void {
  const lynxHost = globalThis.lynx as { queueMicrotask?: (fn: () => void) => void } | undefined;
  if (typeof lynxHost?.queueMicrotask === "function") {
    lynxHost.queueMicrotask(task);
    return;
  }

  // Safe fallback — do not call a possibly-unbound `globalThis.queueMicrotask`
  // from motion shims.
  Promise.resolve().then(task);
}

export function installLynxScheduler(): void {
  const scheduler = __my_react_internal__.currentScheduler.current;
  if (scheduler) {
    scheduler.microTask = lynxMicroTask;
  }

  // flush.ts / schedule-first-screen use this alias of the schedule helpers.
  __my_react_scheduler__.microTask = lynxMicroTask;
}

installLynxScheduler();
