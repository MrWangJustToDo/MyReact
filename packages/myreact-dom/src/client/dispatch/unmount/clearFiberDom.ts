import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";
import type { DomNode } from "@my-react-dom-shared";

export const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.node) {
    if (!(fiber.type & NODE_TYPE.__isPortal__) && fiber !== fiber.root) {
      const dom = fiber.node as DomNode;

      dom.parentElement.removeChild(dom);
    } else {
      fiber.children.forEach(clearFiberDom);
    }
  } else {
    fiber.children.forEach(clearFiberDom);
  }
};

// when a fiber has been deactivate, all the children will unmount, but if there are a portal element, all the children need unmount, so for the next loop, we need append all the children to the portal
export const clearFiberDomWhenDeactivate = (fiber: MyReactFiberNode, needAppend = false) => {
  if (fiber.node) {
    if (!(fiber.type & NODE_TYPE.__isPortal__) && fiber !== fiber.root) {
      const dom = fiber.node as DomNode;

      if (needAppend) fiber.root.globalDispatch.pendingAppend(fiber);

      dom.parentElement.removeChild(dom);
    } else {
      if (fiber.type & NODE_TYPE.__isPortal__) {
        fiber.children.forEach((f) => clearFiberDomWhenDeactivate(f, true));
      } else {
        fiber.children.forEach((f) => clearFiberDomWhenDeactivate(f, needAppend));
      }
    }
  } else {
    fiber.children.forEach((f) => clearFiberDomWhenDeactivate(f, needAppend));
  }
};
