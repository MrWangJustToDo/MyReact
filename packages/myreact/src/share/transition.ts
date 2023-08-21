import { currentRenderPlatform } from "./env";

export const startTransition = (cb: () => void) => {
  if (currentRenderPlatform.current) {
    currentRenderPlatform.current.yieldTask(cb);
  } else {
    throw new Error(`[@my-react/react] 'startTransition' statement have been invoke in a invalid environment`);
  }
};
