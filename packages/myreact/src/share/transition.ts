import { currentRenderPlatform } from "./env";

/**
 * @public
 */
export const startTransition = (cb: () => void) => {
  if (currentRenderPlatform.current) {
    currentRenderPlatform.current.yieldTask(cb);
  } else {
    cb();
  }
};
