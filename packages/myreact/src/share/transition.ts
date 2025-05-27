import { currentScheduler } from "./env";

/**
 * @public
 */
export const startTransition = (cb: () => void) => {
  if (currentScheduler.current) {
    currentScheduler.current.yieldTask(cb);
  } else {
    cb();
  }
};
