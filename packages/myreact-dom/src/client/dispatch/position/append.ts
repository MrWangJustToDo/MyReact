import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE, NODE_TYPE } = __my_react_internal__;

export const append = (fiber: MyReactFiberNode, parentDOM: Element) => {
  if (!fiber) throw new Error("position error, look like a bug");
  if (fiber.patch & PATCH_TYPE.__pendingAppend__) {
    fiber.patch ^= PATCH_TYPE.__pendingAppend__;
  }
  if (fiber.patch & PATCH_TYPE.__pendingPosition__) {
    fiber.patch ^= PATCH_TYPE.__pendingPosition__;
  }
  if (fiber.type & NODE_TYPE.__isPortal__) return;
  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__)) {
    parentDOM.appendChild(fiber.node as Element);
    return;
  }
  let child = fiber.child;
  while (child) {
    append(child, parentDOM);
    child = child.sibling;
  }
};
