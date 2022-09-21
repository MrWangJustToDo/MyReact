import { NODE_TYPE, PATCH_TYPE } from "@my-react/react-shared";

import type { DomFiberNode } from "@my-react-dom-shared";
import type { MyReactFiberNode } from "@my-react/react";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (!fiber) throw new Error("position error, look like a bug");

  if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;

  if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;

  if (fiber.type & NODE_TYPE.__isPortal__) return;

  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__)) {
    let appended = false;
    const action = () => {
      const { element: parentDOM } = parentFiberWithDom.node as DomFiberNode;
      const { element: childDOM } = (fiber.node || {}) as DomFiberNode;
      if (!appended && childDOM) {
        appended = true;
        parentDOM.appendChild(childDOM);
      }
      return Promise.resolve(appended);
    };
    action().then((s) => !s && action());
    return;
  }

  let child = fiber.child;

  while (child) {
    append(child, parentFiberWithDom);
    child = child.sibling;
  }
};
