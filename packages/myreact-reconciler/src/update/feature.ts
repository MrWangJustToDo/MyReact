import type { RenderController } from "@my-react/react";

export const updateLoop = (renderController: RenderController) => {
  while (renderController.hasNext()) {
    const fiber = renderController.getNext();
    if (fiber) {
      const nextFiber = renderController.performToNextFiber(fiber);
      renderController.setYield(nextFiber);
    }
  }
};

export const updateLoopWithConcurrent = (renderController: RenderController) => {
  while (renderController.hasNext() && !renderController.shouldYield()) {
    const fiber = renderController.getNext();
    if (fiber) {
      const nextFiber = renderController.performToNextFiber(fiber);
      renderController.setYield(nextFiber);
    }
  }
};