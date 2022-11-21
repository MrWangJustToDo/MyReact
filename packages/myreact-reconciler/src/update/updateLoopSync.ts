import { nextWorkAsync } from "../generate";

import type { ReconcilerLoopController } from "./updateLoopAsync";

export const updateLoopSync = (loopController: ReconcilerLoopController) => {
  while (loopController.hasNext()) {
    const fiber = loopController.getNext();
    if (fiber) {
      const nextFiber = nextWorkAsync(fiber, loopController);
      loopController.setYield(nextFiber);
    }
  }
};
