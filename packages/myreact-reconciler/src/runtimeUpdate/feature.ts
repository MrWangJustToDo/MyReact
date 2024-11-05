import { performToNextFiberFromRoot, performToNextFiberFromTrigger } from "../renderNextWork";
import { triggerFiberUpdateListener } from "../runtimeFiber";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

let nextWorkFiber: MyReactFiberNode | null = null;

export const updateLoopSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    nextWorkFiber = null;
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromRoot(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber || nextFiber;
    nextWorkFiber = null;
  }
};

export const updateLoopSyncFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    nextWorkFiber = null;
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromTrigger(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber || nextFiber;
    nextWorkFiber = null;
  }
};

export const updateLoopConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    nextWorkFiber = null;
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromRoot(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber || nextFiber;
    nextWorkFiber = null;
  }
};

export const updateLoopConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    nextWorkFiber = null;
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromTrigger(currentFiber, renderDispatch);
    triggerFiberUpdateListener(renderDispatch, currentFiber);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber || nextFiber;
    nextWorkFiber = null;
  }
};

export const setImmediateNextFiber = (fiber: MyReactFiberNode) => {
  if (!nextWorkFiber) {
    nextWorkFiber = fiber;
  }
};
