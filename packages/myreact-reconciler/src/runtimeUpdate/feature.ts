import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { performToNextFiberFromRoot, performToNextFiberFromTrigger } from "../renderNextWork";
import { safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

let nextWorkFiber: MyReactFiberNode | null = null;

export enum updateTypeEnum {
  syncFromRoot,
  syncFromTrigger,
  concurrentFromRoot,
  concurrentFromTrigger,
}

export const mountLoopAllSync = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    nextWorkFiber = null;
    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;
    const nextFiber = performToNextFiberFromRoot(currentFiber, renderDispatch);
    renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber || nextFiber;
    nextWorkFiber = null;
  }
};

const triggerFiberUpdateListener = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallPatchToFiberUpdate() {
      renderDispatch.patchToFiberUpdate?.(fiber);
    },
  });

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberUpdateListener() {
      listenerMap.get(renderDispatch)?.fiberUpdate?.forEach((listener) => listener(fiber));
    },
  });
};

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

const getNextLoop = (type: updateTypeEnum) => {
  switch (type) {
    case updateTypeEnum.syncFromRoot:
      return updateLoopSyncFromRoot;
    case updateTypeEnum.syncFromTrigger:
      return updateLoopSyncFromTrigger;
    case updateTypeEnum.concurrentFromRoot:
      return updateLoopConcurrentFromRoot;
    case updateTypeEnum.concurrentFromTrigger:
      return updateLoopConcurrentFromTrigger;
  }
};

// TODO?
export const processUpdateLoopAll = async (renderDispatch: CustomRenderDispatch, type: updateTypeEnum) => {
  let loopCount = 0;

  while (renderDispatch.pendingAsyncLoadFiberList?.length) {
    const beforeLength = renderDispatch.pendingAsyncLoadFiberList.length;

    const node = renderDispatch.pendingAsyncLoadFiberList.shift();

    await renderDispatch.processFiber(node);

    renderDispatch.runtimeFiber.nextWorkingFiber = node;

    const nextLoop = getNextLoop(type);

    nextLoop(renderDispatch);

    const afterLength = renderDispatch.pendingAsyncLoadFiberList.length;

    if (beforeLength === afterLength) {
      loopCount++;
      if (loopCount > 5) {
        throw new Error("async load loop count is too much");
      }
    }
  }
};
