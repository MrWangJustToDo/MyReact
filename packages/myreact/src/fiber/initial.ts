import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "./instance";

export const initialFiberNode = (fiber: MyReactFiberNode) => {
  fiber.initialType();

  if (__DEV__) {
    fiber.checkElement();
  }

  fiber.initialParent();

  const globalDispatch = fiber.root.root_dispatch;

  globalDispatch.pendingCreate(fiber);

  globalDispatch.pendingUpdate(fiber);

  globalDispatch.pendingAppend(fiber);

  const element = fiber.element;

  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isClassComponent__)) {
    if (typeof element === "object" && element !== null && element.ref) {
      globalDispatch.pendingLayoutEffect(fiber, () => globalDispatch.resolveRef(fiber));
    }
  }

  return fiber;
};
