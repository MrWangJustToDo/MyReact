import { performToNextFiber } from "../renderNextWork";

import type { MyReactContainer } from "../runtimeFiber";

export const updateLoop = (renderContainer: MyReactContainer) => {
  while (renderContainer.nextWorkingFiber) {
    const nextFiber = performToNextFiber(renderContainer.nextWorkingFiber);
    renderContainer.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopWithConcurrent = (renderContainer: MyReactContainer) => {
  const renderDispatch = renderContainer.renderDispatch;
  while (renderContainer.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiber(renderContainer.nextWorkingFiber);
    renderContainer.nextWorkingFiber = nextFiber;
  }
};
