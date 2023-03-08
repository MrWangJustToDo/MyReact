import type { RenderDispatch } from "../runtimeDispatch";
import type { MyReactFiberNode } from "@my-react/react";

export const initialFiberNode = (fiber: MyReactFiberNode) => {

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  renderDispatch.pendingRef(fiber);

  return fiber;
};
