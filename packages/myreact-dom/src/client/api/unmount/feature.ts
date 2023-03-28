import { NODE_TYPE } from "@my-react/react-reconciler";
import { STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { DomNode } from "@my-react-dom-shared";

const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.nativeNode) {
    if (!(fiber.type & NODE_TYPE.__isPortal__)) {
      const dom = fiber.nativeNode as DomNode;

      dom.parentElement?.removeChild(dom);
    } else {
      let child = fiber.child;
      while (child) {
        clearFiberDom(child);
        child = child.sibling;
      }
    }
  } else {
    let child = fiber.child;
    while (child) {
      clearFiberDom(child);
      child = child.sibling;
    }
  }
};

export const clearNode = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  clearFiberDom(fiber);
};
