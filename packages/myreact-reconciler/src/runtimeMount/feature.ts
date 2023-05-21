import { performToNxtFiberWithTrigger, performToNextFiberAsyncWithTrigger } from "../renderNextWork";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const mountLoop = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = performToNxtFiberWithTrigger(pendingFiber, renderDispatch);
  }
};

export const mountLoopAsync = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = await performToNextFiberAsyncWithTrigger(pendingFiber, renderDispatch);
  }
};
