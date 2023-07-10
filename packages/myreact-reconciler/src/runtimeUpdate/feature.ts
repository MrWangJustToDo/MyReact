import { performToNextFiberWithAll, performToNextFiberWithTrigger } from "../renderNextWork";

import type { CustomRenderDispatch } from "../renderDispatch";

export const updateLoopSyncWithAll = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const nextFiber = performToNextFiberWithAll(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopSyncWithTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const nextFiber = performToNextFiberWithTrigger(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentWithAll = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiberWithAll(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentWithTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiberWithTrigger(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};
