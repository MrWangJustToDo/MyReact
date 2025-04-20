import { mountLoopAllSync } from "../runtimeUpdate";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const mountLoopAll = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  renderDispatch.runtimeFiber.nextWorkingFiber = fiber;

  mountLoopAllSync(renderDispatch);
};

export const processMountLoopAll = async (_fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  let loopCount = 0;

  while (renderDispatch.pendingAsyncLoadFiberList?.length) {
    const beforeLength = renderDispatch.pendingAsyncLoadFiberList.length;

    const node = renderDispatch.pendingAsyncLoadFiberList.shift();

    await renderDispatch.processFiber(node);

    mountLoopAll(node, renderDispatch);

    const afterLength = renderDispatch.pendingAsyncLoadFiberList.length;

    if (beforeLength === afterLength) {
      loopCount++;
      if (loopCount > 5) {
        throw new Error("async load loop count is too much");
      }
    }
  }
};
