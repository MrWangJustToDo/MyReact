import { NODE_TYPE } from "@my-react/react-shared";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

export const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    if (!(fiber.type & NODE_TYPE.__isPortal__) && fiber !== fiber.root) {
      const { element: dom } = fiber.node as DomFiberNode;
      dom.parentElement.removeChild(dom);
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};
