import { performToNextFiberWithSkip, performToNxtFiberWithTrigger } from "../renderNextWork";

import type { CustomRenderDispatch } from "../renderDispatch";

export const updateLoopSyncWithSkip = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const nextFiber = performToNextFiberWithSkip(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopSyncWithTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const nextFiber = performToNxtFiberWithTrigger(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentWithSkip = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNextFiberWithSkip(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentWithTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const nextFiber = performToNxtFiberWithTrigger(renderDispatch.runtimeFiber.nextWorkingFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};
