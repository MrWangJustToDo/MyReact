import { __my_react_internal__ } from "@my-react/react";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

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
