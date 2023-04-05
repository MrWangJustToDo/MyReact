import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "./instance";

// no need to resolve map for this fiber, this code only used for fiberRoot init
export const initialFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.container.renderDispatch;

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  if (fiber.ref) {
    renderDispatch.pendingRef(fiber);
  }

  renderDispatch.patchToFiberInitial?.(fiber);

  if (!(fiber.patch & PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }

  return fiber;
};
