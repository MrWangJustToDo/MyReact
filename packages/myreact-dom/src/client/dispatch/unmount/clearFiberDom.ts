import type { MyReactFiberNode } from "@my-react/react";

export const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.dom) {
    if (!fiber.__isPortal__ && !fiber.__root__) {
      fiber.dom?.remove();
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};
