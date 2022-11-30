import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import type { DomElement, DomNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug");

  if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;

  if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;

  if (fiber.type & NODE_TYPE.__isPortal__) return;

  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__ | NODE_TYPE.__isCommentStartNode__ | NODE_TYPE.__isCommentEndNode__)) {
    const parentDOM = parentFiberWithDom.node as DomElement;

    const childDOM = fiber.node as DomNode;

    parentDOM.appendChild(childDOM);

    return;
  }

  let child = fiber.child;

  while (child) {
    append(child, parentFiberWithDom);
    child = child.sibling;
  }
};
