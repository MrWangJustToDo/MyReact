import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export const nativeCreate = (fiber: MyReactFiberNode, isSVG: boolean) => {
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    fiber.node = document.createTextNode(fiber.element as string);
  } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElement = fiber.element as MyReactElement;

    if (isSVG) {
      fiber.node = document.createElementNS("http://www.w3.org/2000/svg", typedElement.type as string);
    } else {
      fiber.node = document.createElement(typedElement.type as string);
    }
  } else {
    const typedElement = fiber.element as MyReactElement;

    fiber.node = typedElement.props["container"] as Element;
  }
};
