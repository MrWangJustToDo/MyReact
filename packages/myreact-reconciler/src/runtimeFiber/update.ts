import { isValidElement } from "@my-react/react";

import type { MyReactFiberNodeDev } from "./interface";
import type { RenderDispatch } from "../runtimeDispatch";
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

  if (prevElement !== nextElement) {
    renderDispatch.processFiberUpdate(fiber);
  }

  if (isValidElement(prevElement) && isValidElement(nextElement) && prevElement.ref !== nextElement.ref) {
    renderDispatch.pendingRef(fiber);
  }

  if (fiber !== prevFiber) {
    renderDispatch.pendingPosition(fiber);
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
