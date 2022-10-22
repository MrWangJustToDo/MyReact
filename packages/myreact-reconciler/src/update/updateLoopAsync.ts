import { nextWorkAsync } from "../generate";

import type { MyReactFiberNode } from "@my-react/react";

export type ReconcilerLoopController = {
  setYield: (f: MyReactFiberNode | null) => void;
  getNext: () => MyReactFiberNode | null;
  getUpdateList: (f: MyReactFiberNode) => void;
  hasNext: () => boolean;
  doesPause: () => boolean;
  getTopLevel: () => MyReactFiberNode | null;
};

export const updateLoopAsync = (loopController: ReconcilerLoopController, shouldPause: () => boolean) => {
  while (loopController.hasNext() && !shouldPause()) {
    const fiber = loopController.getNext();
    if (fiber) {
      const nextFiber = nextWorkAsync(fiber, loopController);
      loopController.setYield(nextFiber);
    }
  }
};
