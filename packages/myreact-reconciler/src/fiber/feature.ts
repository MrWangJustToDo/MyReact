import { isNormalEquals, NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import type { RenderDispatch } from "../dispatch";
import type { MyReactFiberNode } from "@my-react/react";

export const defaultUpdateFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (fiber.type & NODE_TYPE.__isMemo__) {
    if (!(fiber.mode & UPDATE_TYPE.__trigger__) && isNormalEquals(fiber.pendingProps, fiber.memoizedProps)) {
      fiber.afterUpdate();
    } else {
      fiber.prepareUpdate();
    }
  } else {
    fiber.prepareUpdate();

    if (fiber.type & NODE_TYPE.__isContextProvider__) {
      if (!isNormalEquals(fiber.pendingProps.value as Record<string, unknown>, fiber.memoizedProps.value as Record<string, unknown>)) {
        renderDispatch.pendingContext(fiber);
      }
    }

    if (fiber.type & NODE_TYPE.__isPlainNode__) {
      if (!isNormalEquals(fiber.pendingProps, fiber.memoizedProps, (key: string) => key === "children")) {
        renderDispatch.pendingUpdate(fiber);
      }
    }

    if (fiber.type & NODE_TYPE.__isTextNode__) {
      renderDispatch.pendingUpdate(fiber);
    }
  }
};

export const defaultInitialFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  renderDispatch.resolveSuspenseMap(fiber);

  renderDispatch.resolveContextMap(fiber);

  renderDispatch.resolveStrictMap(fiber);

  renderDispatch.resolveScopeMap(fiber);

  renderDispatch.resolveErrorBoundariesMap(fiber);
};
