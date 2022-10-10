import type { MyReactFiberNode } from "@my-react/react";

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  fiber.root.root_dispatch.reconcileCommit(fiber, hydrate, fiber);
};
