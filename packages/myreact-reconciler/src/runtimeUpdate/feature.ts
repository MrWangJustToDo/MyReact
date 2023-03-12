import type { RenderController } from "@my-react/react";

export const updateLoop = (renderController: RenderController) => {
  while (renderController.hasNext()) {
    const fiber = renderController.getNextFiber();
    if (fiber) {
      const nextFiber = renderController.performToNextFiber(fiber);
      renderController.setYieldFiber(nextFiber);
    }
  }
};

export const updateLoopWithConcurrent = (renderController: RenderController) => {
  while (renderController.hasNext() && !renderController.shouldYield()) {
    const fiber = renderController.getNextFiber();
    if (fiber) {
      const nextFiber = renderController.performToNextFiber(fiber);
      renderController.setYieldFiber(nextFiber);
    }
  }
};
