import { asyncUpdateTimeLimit, asyncUpdateTimeStep } from './env';

export const shouldYieldAsyncUpdate = () => {
  if (!asyncUpdateTimeStep.current) {
    asyncUpdateTimeStep.current = performance.now();
    return false;
  } else {
    const result =
      performance.now() - asyncUpdateTimeStep.current > asyncUpdateTimeLimit;
    if (result) asyncUpdateTimeStep.current = null;
    return result;
  }
};
