import { isValidElement } from "@my-react/react";
import { isNormalEquals, PATCH_TYPE, UPDATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev } from "./interface";
import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const updateFiberNode = (
  {
    fiber,
    parent,
    prevFiber,
  }: {
    fiber: MyReactFiberNode;
    parent: MyReactFiberNode;
    prevFiber: MyReactFiberNode;
  },
  nextElement: MyReactElementNode
) => {
  const prevElement = fiber.element;

  fiber._installElement(nextElement);

  fiber._installParent(parent);

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  if (prevElement !== nextElement) {
    if (fiber.type & NODE_TYPE.__isMemo__) {
      if (!(fiber.mode & UPDATE_TYPE.__triggerUpdate__) && isNormalEquals(fiber.pendingProps, fiber.memoizedProps)) {
        fiber._afterUpdate();
      } else {
        fiber._prepareUpdate();

        renderPlatform.patchToFiberUpdate?.(fiber);
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

      renderPlatform.patchToFiberUpdate?.(fiber);
    }
  }

  if (isValidElement(prevElement) && isValidElement(nextElement) && prevElement.ref !== nextElement.ref) {
    renderDispatch.pendingRef(fiber);
  }

  if (fiber !== prevFiber) {
    renderDispatch.pendingPosition(fiber);
  }

  if (!(fiber.patch & PATCH_TYPE.__pendingUpdate__)) {
    fiber._applyProps();
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const timeNow = Date.now();

    const prevRenderState = Object.assign({}, typedFiber._debugRenderState);

    typedFiber._debugRenderState = {
      renderCount: prevRenderState.renderCount + 1,
      mountTime: prevRenderState.mountTime,
      prevUpdateTime: prevRenderState.currentUpdateTime,
      currentUpdateTime: timeNow,
    };
  }

  return fiber;
};
