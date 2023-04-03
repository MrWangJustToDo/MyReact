import { MyReactFiberRoot } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomContainer, ClientDomDispatch } from "@my-react-dom-client";

export const patchToFiberInitial = (_fiber: MyReactFiberNode) => {
  const renderContainer = _fiber.container as ClientDomContainer;

  const renderDispatch = renderContainer.renderDispatch as ClientDomDispatch;

  let isSVG = _fiber.elementType === "svg";

  let parentFiberWithNode = null;

  if (!isSVG) {
    isSVG = renderDispatch.elementMap.get(_fiber.parent)?.isSVG || false;
  }

  if (_fiber.parent) {
    if (_fiber.parent instanceof MyReactFiberRoot) {
      parentFiberWithNode = _fiber.parent;
    } else if (_fiber.parent.type & renderDispatch.hasNodeType) {
      parentFiberWithNode = _fiber.parent;
    } else {
      parentFiberWithNode = renderDispatch.elementMap.get(_fiber.parent)?.parentFiberWithNode;
    }
  }

  renderDispatch.elementMap.set(_fiber, { isSVG, parentFiberWithNode });
};

export const patchToFiberUnmount = (_fiber: MyReactFiberNode) => {
  const renderContainer = _fiber.container as ClientDomContainer;

  const renderDispatch = renderContainer.renderDispatch as ClientDomDispatch;

  renderDispatch.elementMap.delete(_fiber);
};
