import { asyncUpdateTimeLimit, asyncUpdateTimeStep } from "./env";

/**
 * @internal
 */
export function shouldPauseAsyncUpdate() {
  if (!asyncUpdateTimeStep.current) {
    asyncUpdateTimeStep.current = Date.now();
    return false;
  } else {
    const now = Date.now();
    const result = now - asyncUpdateTimeStep.current > asyncUpdateTimeLimit.current;
    if (result) asyncUpdateTimeStep.current = null;
    return result;
  }
}

export function resetPause() {
  asyncUpdateTimeStep.current = Date.now();
}
