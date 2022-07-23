import type { MyReactFiberNode } from '../../../fiber';

export const append = (fiber: MyReactFiberNode, parentDom: Element) => {
  if (fiber.__pendingAppend__) {
    if (fiber.dom) {
      parentDom.appendChild(fiber.dom);
    }
    fiber.__pendingAppend__ = false;
  }
};
