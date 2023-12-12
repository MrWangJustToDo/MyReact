import { performToNextFiberFromRoot, performToNextFiberFromTrigger } from "../renderNextWork";

import type { CustomRenderDispatch } from "../renderDispatch";

export const updateLoopSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const nextFiber = performToNextFiberFromRoot(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopSyncFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const nextFiber = performToNextFiberFromTrigger(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiberFromRoot(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiberFromTrigger(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};
