import { PATCH_TYPE } from "@my-react/react-shared";

import type { RenderDispatch } from "../runtimeDispatch";
import type { MyReactFiberNode } from "@my-react/react";

export const initialFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  renderDispatch.pendingRef(fiber);

  if (!(fiber.patch & PATCH_TYPE.__pendingUpdate__)) {
    fiber._applyProps();
  }

  return fiber;
};
