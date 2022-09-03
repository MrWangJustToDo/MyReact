import type { MyReactFiberNode } from "@my-react/react";

export const append = (fiber: MyReactFiberNode, parentDOM: Element) => {
  if (!fiber) throw new Error("position error, look like a bug");
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    parentDOM.appendChild(fiber.dom as Element);
    return;
  }
  let child = fiber.child;
  while (child) {
    append(child, parentDOM);
    child = child.sibling;
  }
};
