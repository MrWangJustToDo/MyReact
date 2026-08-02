import { type MyReactElementNode, createElement } from "@my-react/react/type";
import { nextWorkNormal } from "@my-react/react-reconciler";
import { Portal } from "@my-react/react-shared";

import type { RenderContainer } from "./feature";
import type { MyReactFiberNode, MyReactFiberContainer, CustomRenderDispatch } from "@my-react/react-reconciler";

export function createPortal(_element: MyReactElementNode, _container: RenderContainer) {
  const portal = createElement(Portal, { container: _container }, _element);

  return portal;
}

export function nextWorkPortal(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
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
}
