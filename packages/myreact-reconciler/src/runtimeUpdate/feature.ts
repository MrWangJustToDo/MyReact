import { performToNextFiberFromRoot, performToNextFiberFromTrigger } from "../renderNextWork";
import { triggerFiberUpdateListener } from "../runtimeFiber";

import type { CustomRenderDispatch } from "../renderDispatch";

export const updateLoopSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromRoot(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopSyncFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromTrigger(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromRoot(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};

export const updateLoopConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromTrigger(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextFiber;
  }
};
