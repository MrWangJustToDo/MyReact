import { currentScheduler } from "./env";

/**
 * @public
 */
export function startTransition(cb: () => void) {
  if (currentScheduler.current) {
    currentScheduler.current.yieldTask(cb);
  } else {
    cb();
  }
}
