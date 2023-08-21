import { STATE_TYPE, include } from "@my-react/react-shared";

import { log } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { DomNode } from "@my-react-dom-shared";

const clearFiberDom = (fiber: MyReactFiberNode) => {
  if (fiber.nativeNode) {
    const dom = fiber.nativeNode as DomNode;
    try {
      dom.parentNode?.removeChild(dom);
    } catch (e) {
      log(fiber, "error", `error for remove dom`, e);
    }
  }
};

/**
 * @internal
 */
export const clearNode = (fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  clearFiberDom(fiber);
};
