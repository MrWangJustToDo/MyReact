import { nextWorkAsync } from "../generate";

import type { ReconcilerLoopController } from "./updateLoopAsync";
import type { MyReactFiberNode } from "@my-react/react";

export const updateLoopSync = (loopController: ReconcilerLoopController) => {
  if (loopController.hasNext()) {
    let fiber = loopController.getNext();
    while (fiber) {
      const _fiber = fiber as MyReactFiberNode;
      fiber = nextWorkAsync(_fiber, loopController);
      loopController.getUpdateList(_fiber);
      loopController.setYield(fiber);
    }
  }
};
