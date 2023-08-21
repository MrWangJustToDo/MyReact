import { PATCH_TYPE, exclude } from "@my-react/react-shared";

import { fiberToDispatchMap } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { CustomRenderDispatch } from "../renderDispatch";

// no need to resolve map for this fiber, this code only used for fiberRoot init
export const initialFiberNode = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  fiberToDispatchMap.set(fiber, renderDispatch);

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  renderDispatch.pendingRef(fiber);

  renderDispatch.patchToFiberInitial?.(fiber);

  if (exclude(fiber.patch, PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }
  return fiber;
};
