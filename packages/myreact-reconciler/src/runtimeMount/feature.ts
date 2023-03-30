import { performToNxtFiberWithTrigger, performToNextFiberAsyncWithTrigger } from "../renderNextWork";

import type { MyReactFiberNode } from "../runtimeFiber";

export const mountLoop = (fiber: MyReactFiberNode) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = performToNxtFiberWithTrigger(pendingFiber);
  }
};

export const mountLoopAsync = async (fiber: MyReactFiberNode) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = await performToNextFiberAsyncWithTrigger(pendingFiber);
  }
};
