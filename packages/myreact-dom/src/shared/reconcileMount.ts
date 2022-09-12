import type { MyReactFiberNode } from "@my-react/react";

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  fiber.root.dispatch.reconcileCommit(fiber, hydrate, fiber);
};
