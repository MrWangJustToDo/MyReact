import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE, NODE_TYPE } = __my_react_internal__;

export const insertBefore = (fiber: MyReactFiberNode, beforeDOM: Element, parentDOM: Element) => {
  if (!fiber) throw new Error("position error, look like a bug");
  fiber.patch ^= PATCH_TYPE.__pendingAppend__;
  fiber.patch ^= PATCH_TYPE.__pendingPosition__;
  if (fiber.type & NODE_TYPE.__isPortal__) return;
  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__)) {
    parentDOM.insertBefore(fiber.node as Element, beforeDOM);
    return;
  }
  let child = fiber.child;
  while (child) {
    insertBefore(child, beforeDOM, parentDOM);
    child = child.sibling;
  }
  // fiber.children.forEach((f) => insertBefore(f, beforeDOM, parentDOM));
};
