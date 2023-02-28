import { asyncUpdateTimeLimit, asyncUpdateTimeStep } from "./env";

export const shouldPauseAsyncUpdate = () => {
  if (!asyncUpdateTimeStep.current) {
    asyncUpdateTimeStep.current = Date.now();
    return false;
  } else {
    const now = Date.now();
    const result = now - asyncUpdateTimeStep.current > asyncUpdateTimeLimit;
    if (result) asyncUpdateTimeStep.current = now;
    return result;
  }
};
