import { checkFiberElement } from "./check";

import type { MyReactFiberNode } from "./instance";

export const initialFiberNode = (fiber: MyReactFiberNode) => {
  fiber.initialType();

  if (__DEV__) checkFiberElement(fiber);

  fiber.initialParent();

  const globalDispatch = fiber.root.globalDispatch;

  globalDispatch.pendingCreate(fiber);

  globalDispatch.pendingUpdate(fiber);

  globalDispatch.pendingAppend(fiber);

  globalDispatch.pendingRef(fiber);

  globalDispatch.resolveMemorizedProps(fiber);

  return fiber;
};
