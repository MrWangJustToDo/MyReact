import { safeCall } from '../share';

import { nextWorkAsync } from './invoke';

import type { MyReactFiberNode } from '../fiber';

export const updateLoopSync = (
  loopController: {
    hasNext: () => boolean;
    getNext: () => MyReactFiberNode | null;
    getUpdateList: (f: MyReactFiberNode) => void;
    setYield: (f: MyReactFiberNode | null) => void;
  },
  reconcileUpdate: () => void
) => {
  if (loopController.hasNext()) {
    let fiber = loopController.getNext();
    while (fiber) {
      const _fiber = fiber as MyReactFiberNode;
      fiber = safeCall(() => nextWorkAsync(_fiber));
      loopController.getUpdateList(_fiber);
      loopController.setYield(fiber);
    }
  }
  reconcileUpdate();
};
