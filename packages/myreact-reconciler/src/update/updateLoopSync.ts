import { __my_react_shared__ } from "@my-react/react";

import { nextWorkAsync } from "../generate";

import type { MyReactFiberNode } from "@my-react/react";

const { safeCall } = __my_react_shared__;

export const updateLoopSync = (
  loopController: {
    hasNext: () => boolean;
    getNext: () => MyReactFiberNode | null;
    getUpdateList: (f: MyReactFiberNode) => void;
    setYield: (f: MyReactFiberNode | null) => void;
    getTopLevel: () => MyReactFiberNode | null;
  },
  reconcileUpdate: () => void
) => {
  if (loopController.hasNext()) {
    let fiber = loopController.getNext();
    while (fiber) {
      const _fiber = fiber as MyReactFiberNode;
      fiber = safeCall(() => nextWorkAsync(_fiber, loopController.getTopLevel()));
      loopController.getUpdateList(_fiber);
      loopController.setYield(fiber);
    }
  }
  reconcileUpdate();
};
