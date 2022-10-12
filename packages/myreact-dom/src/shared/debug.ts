import type { DomElement, DomNode } from "./dom";
import type { MyReactFiberNode } from "@my-react/react";

export const debugWithDOM = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    const debugDOM = fiber.node as DomElement | DomNode;
    debugDOM["__fiber__"] = fiber;
    debugDOM["__element__"] = fiber.element;
    debugDOM["__children__"] = fiber.children;
  }
};
