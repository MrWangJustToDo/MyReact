import { STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { DomNode } from "@my-react-dom-shared";

const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.nativeNode) {
    const dom = fiber.nativeNode as DomNode;

    dom.parentElement?.removeChild(dom);
  } else {
    let child = fiber.child;
    while (child) {
      clearFiberDom(child);
      child = child.sibling;
    }
  }
};

/**
 * @internal
 */
export const clearNode = (fiber: MyReactFiberNode) => {
  if (fiber.state & STATE_TYPE.__unmount__) return;

  clearFiberDom(fiber);
};
