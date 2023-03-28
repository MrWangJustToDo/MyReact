import { performToNextFiber, performToNextFiberAsync } from "../renderNextWork";

import type { MyReactFiberNode } from "../runtimeFiber";

export const mountLoop = (fiber: MyReactFiberNode) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = performToNextFiber(pendingFiber);
  }
};

export const mountLoopAsync = async (fiber: MyReactFiberNode) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = await performToNextFiberAsync(pendingFiber);
  }
};
