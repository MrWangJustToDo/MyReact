import { createElement } from "@my-react/react";
import { currentRenderDispatch, nextWorkNormal } from "@my-react/react-reconciler";
import { Portal } from "@my-react/react-shared";

import type { MyReactElement } from "@my-react/react";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

const checkPortal = (element: MyReactElement) => {
  if (!element.props["container"]) throw new Error(`[@my-react/react-dom] a portal element need a "container" props`);
};

export const createPortal = (element: MyReactElement, container: HTMLElement) => {
  const portal = createElement(Portal, { container }, element);

  if (__DEV__) checkPortal(portal);

  return portal;
};

export const nextWorkPortal = (fiber: MyReactFiberNode) => {
  const typedFiber = fiber as MyReactFiberContainer;

  const renderDispatch = currentRenderDispatch.current;

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
