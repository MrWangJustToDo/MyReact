import { NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const insertBefore = (fiber: MyReactFiberNode, beforeFiberWithDom: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug");

  if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;

  if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;

  if (fiber.type & NODE_TYPE.__isPortal__) return;

  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__ | NODE_TYPE.__isCommentNode__)) {
    const parentDOM = parentFiberWithDom.node as DomElement;

    const beforeDOM = beforeFiberWithDom.node as DomNode;

    const childDOM = fiber.node as DomNode;

    parentDOM.insertBefore(childDOM, beforeDOM);

    return;
  }

  let child = fiber.child;

  while (child) {
    insertBefore(child, beforeFiberWithDom, parentFiberWithDom);

    child = child.sibling;
  }
};
