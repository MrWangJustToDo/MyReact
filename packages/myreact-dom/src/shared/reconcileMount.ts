import type { MyReactFiberNode } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  renderDispatch.reconcileCommit(fiber, hydrate);
};
