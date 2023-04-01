import { performToNextFiberWithSkip, performToNxtFiberWithTrigger } from "../renderNextWork";

import type { MyReactContainer } from "../runtimeFiber";

export const updateLoopSyncWithSkip = (renderContainer: MyReactContainer) => {
  while (renderContainer.nextWorkingFiber) {
    const nextFiber = performToNextFiberWithSkip(renderContainer.nextWorkingFiber);
    renderContainer.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopSyncWithTrigger = (renderContainer: MyReactContainer) => {
  while (renderContainer.nextWorkingFiber) {
    const nextFiber = performToNxtFiberWithTrigger(renderContainer.nextWorkingFiber);
    renderContainer.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentWithSkip = (renderContainer: MyReactContainer) => {
  const renderDispatch = renderContainer.renderDispatch;
  while (renderContainer.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiberWithSkip(renderContainer.nextWorkingFiber);
    renderContainer.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentWithTrigger = (renderContainer: MyReactContainer) => {
  const renderDispatch = renderContainer.renderDispatch;
  while (renderContainer.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNxtFiberWithTrigger(renderContainer.nextWorkingFiber);
    renderContainer.nextWorkingFiber = nextFiber;
  }
};
