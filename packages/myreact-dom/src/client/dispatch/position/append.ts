import { __my_react_internal__ } from "@my-react/react";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE, NODE_TYPE } = __my_react_internal__;

export const append = (fiber: MyReactFiberNode, parentNode: DomFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug");

  if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;

  if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;

  if (fiber.type & NODE_TYPE.__isPortal__) return;

  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__)) {
    if (!fiber.node) console.log('append error', fiber);
    const { element: parentDOM } = parentNode;
    const { element: childDOM } = fiber.node as DomFiberNode;
    parentDOM.appendChild(childDOM);
    return;
  }

  let child = fiber.child;

  while (child) {
    append(child, parentNode);
    child = child.sibling;
  }
};
