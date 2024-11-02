import { updateLoopSyncFromRoot } from "../runtimeUpdate";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

export const mountLoop = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  renderDispatch.runtimeFiber.nextWorkingFiber = fiber;
  updateLoopSyncFromRoot(renderDispatch);
};
