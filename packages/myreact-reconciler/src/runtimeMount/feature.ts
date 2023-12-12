import { performToNextFiberFromRoot } from "../renderNextWork";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const mountLoop = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  let pendingFiber = fiber;
  while (pendingFiber) {
    pendingFiber = performToNextFiberFromRoot(pendingFiber, renderDispatch);
  }
};
