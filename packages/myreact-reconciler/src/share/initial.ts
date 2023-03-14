import { getElementTypeFromElement } from "./elementType";

import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const initialTypeFromElement = (fiber: MyReactFiberNode, element: MyReactElementNode) => {
  const { nodeType, elementType } = getElementTypeFromElement(element);

  fiber.type = nodeType;

  fiber.elementType = elementType;
};

export const initialPropsFromELement = (fiber: MyReactFiberNode, element: MyReactElementNode) => {
  if (typeof element === "object") {
    fiber.key = element?.key;

    fiber.ref = element?.ref;

    fiber.pendingProps = Object.assign({}, element?.props);
  }
};
