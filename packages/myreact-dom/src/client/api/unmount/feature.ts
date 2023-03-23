import { NODE_TYPE } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react";
import type { DomNode } from "@my-react-dom-shared";

const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    if (!(fiber.type & NODE_TYPE.__isPortal__) && fiber !== fiber.root) {
      const dom = fiber.node as DomNode;

      dom.parentElement?.removeChild(dom);
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};

export const unmount = (fiber: MyReactFiberNode) => {
  if (!fiber.isMounted) return;

  clearFiberDom(fiber);
};