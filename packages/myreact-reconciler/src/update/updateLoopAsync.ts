import { __myreact_shared__ } from "@my-react/react";

import { nextWorkAsync } from "../generate";

import type { MyReactFiberNode } from "@my-react/react";

const { safeCall } = __myreact_shared__;

export const updateLoopAsync = (
  loopController: {
    setYield: (f: MyReactFiberNode | null) => void;
    getNext: () => MyReactFiberNode | null;
    getUpdateList: (f: MyReactFiberNode) => void;
    hasNext: () => boolean;
    doesPause: () => boolean;
    getTopLevel: () => MyReactFiberNode | null;
  },
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
