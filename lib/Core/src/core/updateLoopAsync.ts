import { safeCall } from '../share';

import { nextWorkAsync } from './invoke';

import type { MyReactFiberNode } from '../fiber';

export const updateLoopAsync = (
  loopController: {
    setYield: (f: MyReactFiberNode | null) => void;
    getNext: () => MyReactFiberNode | null;
    getUpdateList: (f: MyReactFiberNode) => void;
    hasNext: () => boolean;
    doesPause: () => boolean;
  },
  shouldPause: () => boolean,
  reconcileUpdate: () => void
) => {
  while (loopController.hasNext() && !shouldPause()) {
    const fiber = loopController.getNext();
    if (fiber) {
      const nextFiber = safeCall(() => nextWorkAsync(fiber));
      loopController.getUpdateList(fiber);
      loopController.setYield(nextFiber);
    }
  }
  if (!loopController.doesPause()) {
    reconcileUpdate();
  }
};
