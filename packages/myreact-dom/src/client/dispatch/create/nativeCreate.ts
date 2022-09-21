import { __my_react_internal__ } from "@my-react/react";

import { createDomNode } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    fiber.node = createDomNode(document.createTextNode(fiber.element as string));
  } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElement = fiber.element as MyReactElement;

    if (isSVG) {
      fiber.node = createDomNode(document.createElementNS("http://www.w3.org/2000/svg", typedElement.type as string));
    } else {
      fiber.node = createDomNode(document.createElement(typedElement.type as string));
    }
  } else {
    const typedElement = fiber.element as MyReactElement;

    fiber.node = createDomNode(typedElement.props["container"] as Element);
  }
};
