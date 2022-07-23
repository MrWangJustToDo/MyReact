import {
  isAppCrash,
  pendingAsyncModifyFiberArray,
  pendingAsyncModifyTopLevelFiber,
  pendingReconcileFiberArray,
  pendingSyncModifyFiberArray,
  yieldAsyncModifyFiber,
} from '../../../share';

import type { MyReactFiberNode } from '../../../fiber';

export const getPendingSyncModifyFiberArray = () => {
  if (isAppCrash.current) return [];

  const pendingUpdate = pendingSyncModifyFiberArray.current
    .slice(0)
    .filter((f) => f.__needUpdate__ && f.mount);

  pendingSyncModifyFiberArray.current = [];

  return pendingUpdate;
};

export const pendingAsyncModifyFiberControl = {
  setYield: (fiber: MyReactFiberNode | null) => {
    if (fiber) {
      yieldAsyncModifyFiber.current = fiber;
    }
  },
  getNext: () => {
    if (isAppCrash.current) return null;
    const fiber = yieldAsyncModifyFiber.current;
    yieldAsyncModifyFiber.current = null;
    if (fiber?.mount) {
      return fiber;
    }
    while (pendingAsyncModifyFiberArray.current.length) {
      const nextFiber = pendingAsyncModifyFiberArray.current.shift();
      if (nextFiber?.mount) {
        pendingReconcileFiberArray.current.push(nextFiber);
        pendingAsyncModifyTopLevelFiber.current = nextFiber;
        return nextFiber;
      }
    }
    return null;
  },
  hasNext: () => {
    if (isAppCrash.current) return false;
    return (
      yieldAsyncModifyFiber.current !== null ||
      pendingAsyncModifyFiberArray.current.length > 0
    );
  },
  doesPause: () => yieldAsyncModifyFiber.current !== null,
};
