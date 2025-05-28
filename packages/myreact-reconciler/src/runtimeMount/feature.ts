import { mountToNextFiberFromRoot } from "../renderNextWork";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const mountLoopAllSync = (renderDispatch: CustomRenderDispatch) => {
  while (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderDispatch.runtimeFiber.immediateUpdateFiber = null;

    const currentFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

    const nextFiber = mountToNextFiberFromRoot(renderDispatch, currentFiber);

    const immediateUpdateFiber = renderDispatch.runtimeFiber.immediateUpdateFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = immediateUpdateFiber || nextFiber;

    renderDispatch.runtimeFiber.immediateUpdateFiber = null;
  }
};

export const mountLoopAll = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  renderDispatch.runtimeFiber.scheduledFiber = fiber;

  renderDispatch.runtimeFiber.nextWorkingFiber = fiber;

  mountLoopAllSync(renderDispatch);
};

export const processMountLoopAll = async (renderDispatch: CustomRenderDispatch, _fiber: MyReactFiberNode) => {
  let loopCount = 0;

  while (renderDispatch.pendingAsyncLoadList?.length) {
    const beforeLength = renderDispatch.pendingAsyncLoadList.length;

    const node = renderDispatch.pendingAsyncLoadList.shift();

    if (typeof node === "object") {
      await renderDispatch.processFiber(node);

      mountLoopAll(renderDispatch, node);
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
