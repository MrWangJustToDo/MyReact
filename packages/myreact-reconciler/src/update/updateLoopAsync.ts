import { __my_react_shared__ } from "@my-react/react";

import { nextWorkAsync } from "../generate";

import type { MyReactFiberNode } from "@my-react/react";

const { safeCall } = __my_react_shared__;

export type ReconcilerLoopController = {
  setYield: (f: MyReactFiberNode | null) => void;
  getNext: () => MyReactFiberNode | null;
  getUpdateList: (f: MyReactFiberNode) => void;
  hasNext: () => boolean;
  doesPause: () => boolean;
  getTopLevel: () => MyReactFiberNode | null;
};

export const updateLoopAsync = (
  loopController: ReconcilerLoopController,
  shouldPause: () => boolean,
  reconcileUpdate: () => void
) => {
  while (loopController.hasNext() && !shouldPause()) {
    const fiber = loopController.getNext();
    if (fiber) {
      const nextFiber = safeCall(() => nextWorkAsync(fiber, loopController.getTopLevel()));
      loopController.getUpdateList(fiber);
      loopController.setYield(nextFiber);
    }
  }
  if (!loopController.doesPause()) {
    reconcileUpdate();
  }
};
