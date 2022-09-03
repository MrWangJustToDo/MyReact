import type { MyReactFiberNode } from "@my-react/react";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.__pendingAppend__) {
    if (!fiber.dom || !parentFiberWithDom.dom) throw new Error("append error");
    const parentDom = parentFiberWithDom.dom as Element;
    if (fiber.dom) {
      parentDom.appendChild(fiber.dom);
    }
    fiber.__pendingAppend__ = false;
  }
};
