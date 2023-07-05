import { asyncUpdateTimeLimit, asyncUpdateTimeStep } from "./env";

/**
 * @internal
 */
export const shouldPauseAsyncUpdate = () => {
  if (!asyncUpdateTimeStep.current) {
    asyncUpdateTimeStep.current = Date.now();
    return false;
  } else {
    const now = Date.now();
    const result = now - asyncUpdateTimeStep.current > asyncUpdateTimeLimit.current;
    if (result) asyncUpdateTimeStep.current = null;
    return result;
  }
};
