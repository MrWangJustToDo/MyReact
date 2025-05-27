import { type MyReactElementNode, createElement } from "@my-react/react";
import { currentRenderDispatch, getCurrentDispatchFromFiber, nextWorkNormal } from "@my-react/react-reconciler";
import { Portal } from "@my-react/react-shared";

import type { RenderContainer } from "./feature";
import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

export const createPortal = (_element: MyReactElementNode, _container: RenderContainer) => {
  const portal = createElement(Portal, { container: _container }, _element);

  return portal;
};

export const nextWorkPortal = (fiber: MyReactFiberNode) => {
  const typedFiber = fiber as MyReactFiberContainer;

  const renderDispatch = currentRenderDispatch.current || getCurrentDispatchFromFiber(fiber);

  nextWorkNormal(fiber);

  if (typedFiber.containerNode !== fiber.pendingProps["container"]) {
    renderDispatch.pendingCreate(fiber);

    let child = fiber.child;

    while (child) {
      renderDispatch.pendingAppend(child);

      child = child.sibling;
    }
  }
};
