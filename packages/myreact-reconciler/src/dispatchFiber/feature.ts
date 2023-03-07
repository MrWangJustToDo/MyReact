import { isNormalEquals, NODE_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import type { RenderDispatch } from "../runtimeDispatch";
import type { MyReactFiberNode } from "@my-react/react";

export const defaultUpdateFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (fiber.type & NODE_TYPE.__isMemo__) {
    if (!(fiber.mode & UPDATE_TYPE.__trigger__) && isNormalEquals(fiber.pendingProps, fiber.memoizedProps)) {
      fiber._afterUpdate();
    } else {
      fiber._prepareUpdate();
    }
  } else {
    fiber._prepareUpdate();

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

export const defaultUnmountFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  renderDispatch.suspenseMap.delete(fiber);

  renderDispatch.strictMap.delete(fiber);

  renderDispatch.errorBoundariesMap.delete(fiber);

  renderDispatch.effectMap.delete(fiber);

  renderDispatch.layoutEffectMap.delete(fiber);

  renderDispatch.contextMap.delete(fiber);

  renderDispatch.unmountMap.delete(fiber);

  renderDispatch.eventMap.delete(fiber);

  fiber.node = null;

  fiber.child = null;

  fiber.return = null;

  fiber.parent = null;

  fiber.sibling = null;

  fiber.children = null;

  fiber.instance = null;

  fiber.hookNodes = null;

  fiber.dependence = null;

  fiber.isMounted = false;
};
