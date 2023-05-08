import { currentComponentFiber, currentRenderPlatform } from "./env";

export const startTransition = (cb: () => void) => {
  if (currentRenderPlatform.current) {
    if (currentComponentFiber.current) {
      currentRenderPlatform.current.yieldTask(cb);
    } else {
      throw new Error(`'startTransition' statement only can invoke in a Component`)
    }
  } else {
    throw new Error(`'startTransition' statement have been invoke in a invalid environment`);
  }
};
