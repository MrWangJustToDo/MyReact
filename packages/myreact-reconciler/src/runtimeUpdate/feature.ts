import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { performToNextFiberFromRoot, performToNextFiberFromTrigger, mountToNextFiberFromRoot } from "../renderNextWork";
import { processAsyncLoadListOnSyncMount } from "../runtimeMount";
import { safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

export enum updateTypeEnum {
  syncFromRoot,
  syncFromTrigger,
  concurrentFromRoot,
  concurrentFromTrigger,
}

export const mountLoopAllSync = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = mountToNextFiberFromRoot(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

export const triggerFiberUpdateListener = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
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
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromRoot(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

export const updateLoopSyncFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromTrigger(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

export const updateLoopConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromRoot(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

export const updateLoopConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    renderDispatch.runtimeFiber.retriggerFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromTrigger(renderDispatch, currentFiber);

    const retriggerFiber = renderDispatch.runtimeFiber.retriggerFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = retriggerFiber || nextFiber;

    renderDispatch.runtimeFiber.retriggerFiber = null;
  }
};

// const getNextLoop = (type: updateTypeEnum) => {
//   switch (type) {
//     case updateTypeEnum.syncFromRoot:
//       return updateLoopSyncFromRoot;
//     case updateTypeEnum.syncFromTrigger:
//       return updateLoopSyncFromTrigger;
//     case updateTypeEnum.concurrentFromRoot:
//       return updateLoopConcurrentFromRoot;
//     case updateTypeEnum.concurrentFromTrigger:
//       return updateLoopConcurrentFromTrigger;
//   }
// };

export const processAsyncLoadListOnUpdate = processAsyncLoadListOnSyncMount;
