import { createElement } from "@my-react/react";
import { nextWorkNormal } from "@my-react/react-reconciler";
import { Portal } from "@my-react/react-shared";

import type { MyReactElement } from "@my-react/react";
import type { CustomRenderDispatch, MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

const checkPortal = (element: MyReactElement) => {
  if (!element.props["container"]) throw new Error(`[@my-react/react-dom] a portal element need a "container" props`);
};

export const createPortal = (element: MyReactElement, container: HTMLElement) => {
  const portal = createElement(Portal, { container }, element);

  if (__DEV__) checkPortal(portal);

  return portal;
};

export const nextWorkPortal = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  const typedFiber = fiber as MyReactFiberContainer;

  nextWorkNormal(renderDispatch, fiber);

  if (typedFiber.containerNode !== fiber.pendingProps["container"]) {
    renderDispatch.pendingCreate(fiber);

    let child = fiber.child;

    while (child) {
      renderDispatch.pendingAppend(child);

      child = child.sibling;
    }
  }
};
