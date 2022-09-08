import type { MyReactFiberNode } from "@my-react/react";

export const debugWithDOM = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    const debugDOM = fiber.node as Element & {
      __fiber__: MyReactFiberNode;
      __element__: MyReactFiberNode["element"];
      __children__: MyReactFiberNode["children"];
    };
    debugDOM["__fiber__"] = fiber;
    debugDOM["__element__"] = fiber.element;
    debugDOM["__children__"] = fiber.children;
  }
};
