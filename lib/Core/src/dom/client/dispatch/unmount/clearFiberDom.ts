import type { MyReactFiberNode } from '../../../../fiber';

export const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.dom) {
    if (!fiber.__isPortal__) {
      fiber.dom?.remove();
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};
