import type { DomElement, DomFiberNode } from "./dom";
import type { MyReactFiberNode } from "@my-react/react";

export const debugWithDOM = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    const { element } = fiber.node as DomFiberNode;
    const debugDOM = element as DomElement;
    debugDOM["__fiber__"] = fiber;
    debugDOM["__element__"] = fiber.element;
    debugDOM["__children__"] = fiber.children;
  }
};
