import { isNormalEquals, NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

export const defaultUpdateFiberNode = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  if (fiber.type & NODE_TYPE.__isMemo__) {
    if (!(fiber.mode & UPDATE_TYPE.__trigger__) && isNormalEquals(fiber.pendingProps, fiber.memoizedProps) && fiber.isActivated) {
      fiber.afterUpdate();
    } else {
      fiber.prepareUpdate();
    }
  } else {
    fiber.prepareUpdate();

    if (fiber.type & NODE_TYPE.__isContextProvider__) {
      if (!isNormalEquals(fiber.pendingProps.value as Record<string, unknown>, fiber.memoizedProps.value as Record<string, unknown>)) {
        globalDispatch.pendingContext(fiber);
      }
    }

    if (fiber.type & NODE_TYPE.__isPlainNode__) {
      if (!isNormalEquals(fiber.pendingProps, fiber.memoizedProps, (key: string) => key === "children")) {
        globalDispatch.pendingUpdate(fiber);
      }
    }

    if (fiber.type & NODE_TYPE.__isTextNode__) {
      globalDispatch.pendingUpdate(fiber);
    }
  }
};
