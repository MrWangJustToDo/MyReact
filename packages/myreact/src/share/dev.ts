import { currentComponentFiber, currentRunningFiber, currentScheduler, currentScopeFiber } from "./env";

export const captureOwnerStack = () => {
  if (__DEV__) {
    const scheduler = currentScheduler.current;

    const componentFiber = currentComponentFiber.current || currentRunningFiber.current || currentScopeFiber.current;

    if (scheduler && componentFiber) {
      return scheduler.getFiberTree(componentFiber);
    }
  }
};
