import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { performToNextFiberFromRoot, performToNextFiberFromTrigger, mountToNextFiberFromRoot } from "../renderNextWork";
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
    renderDispatch.runtimeFiber.immediateUpdateFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = mountToNextFiberFromRoot(renderDispatch, currentFiber);

    const immediateUpdateFiber = renderDispatch.runtimeFiber.immediateUpdateFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = immediateUpdateFiber || nextFiber;

    renderDispatch.runtimeFiber.immediateUpdateFiber = null;
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
    renderDispatch.runtimeFiber.immediateUpdateFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromRoot(renderDispatch, currentFiber);

    const immediateUpdateFiber = renderDispatch.runtimeFiber.immediateUpdateFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = immediateUpdateFiber || nextFiber;

    renderDispatch.runtimeFiber.immediateUpdateFiber = null;
  }
};

export const updateLoopSyncFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderDispatch.runtimeFiber.immediateUpdateFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromTrigger(renderDispatch, currentFiber);

    const immediateUpdateFiber = renderDispatch.runtimeFiber.immediateUpdateFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = immediateUpdateFiber || nextFiber;

    renderDispatch.runtimeFiber.immediateUpdateFiber = null;
  }
};

export const updateLoopConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    renderDispatch.runtimeFiber.immediateUpdateFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromRoot(renderDispatch, currentFiber);

    const immediateUpdateFiber = renderDispatch.runtimeFiber.immediateUpdateFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = immediateUpdateFiber || nextFiber;

    renderDispatch.runtimeFiber.immediateUpdateFiber = null;
  }
};

export const updateLoopConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber && !renderDispatch.shouldYield()) {
    renderDispatch.runtimeFiber.immediateUpdateFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = performToNextFiberFromTrigger(renderDispatch, currentFiber);

    const immediateUpdateFiber = renderDispatch.runtimeFiber.immediateUpdateFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = immediateUpdateFiber || nextFiber;

    renderDispatch.runtimeFiber.immediateUpdateFiber = null;
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

  while (renderDispatch.pendingAsyncLoadList?.length) {
    const beforeLength = renderDispatch.pendingAsyncLoadList.length;

    const node = renderDispatch.pendingAsyncLoadList.shift();

    if (typeof node === "object") {
      await renderDispatch.processFiber(node);

      renderDispatch.runtimeFiber.nextWorkingFiber = node;

      const nextLoop = getNextLoop(type);

      nextLoop(renderDispatch);
    } else {
      await node();
    }

    const afterLength = renderDispatch.pendingAsyncLoadList.length;

    if (beforeLength <= afterLength) {
      loopCount++;
      if (loopCount > 5) {
        throw new Error("async load loop count is too much");
      }
    }
  }
};
