import type { MyReactFiberNode } from "@my-react/react";

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  fiber.root.globalDispatch.reconcileCommit(fiber, hydrate, fiber);
};
