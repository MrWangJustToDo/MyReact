import { safeCall } from '../share';

import { nextWorkAsync } from './donext';
import { transformAll, transformStart } from './transform';

import type { MyReactFiberNode } from '../fiber';

export const renderLoopSync = (fiber: MyReactFiberNode) => {
  transformStart(fiber);
  transformAll();
};

export const renderLoopAsync = (
  loopController: {
    setYield: (f: MyReactFiberNode | null) => void;
    getNext: () => MyReactFiberNode | null;
    hasNext: () => boolean;
    doesPause: () => boolean;
  },
  shouldPause: () => boolean,
  reconcileCommit: () => void,
  afterAsyncLoop: () => void
) => {
  while (loopController.hasNext() && !shouldPause()) {
    const fiber = loopController.getNext();
    if (fiber) {
      const nextFiber = safeCall(() => nextWorkAsync(fiber));
      loopController.setYield(nextFiber);
    }
  }
  if (!loopController.doesPause()) {
    reconcileCommit();
  }
  afterAsyncLoop();
};
