import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";
import type { DomNode } from "@my-react-dom-shared";

export const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    if (!(fiber.type & NODE_TYPE.__isPortal__) && fiber !== fiber.root) {
      const dom = fiber.node as DomNode;

      dom.parentElement?.removeChild(dom);
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    console.log(fiber, fiber.children);
    fiber.children.forEach(clearFiberDom);
  }
};

export const clearFiberNode = (fiber: MyReactFiberNode) => {
  fiber.node = null;
  fiber.child = null;
  fiber.return = null;
  fiber.parent = null;
  fiber.sibling = null;
  fiber.children = null;
  fiber.instance = null;
  fiber.hookNodes = null;
  fiber.dependence = null;
  fiber.isMounted = false;
};

// when a fiber has been deactivate, all the children will unmount, but if there are a portal element, all the children need unmount, so for the next loop, we need append all the children to the portal
