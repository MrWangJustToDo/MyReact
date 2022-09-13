import { __my_react_internal__ } from "@my-react/react";

import { IS_SINGLE_ELEMENT } from "@ReactDOM_shared";

import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE } = __my_react_internal__;

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingAppend__) {
    if (!fiber.node || !parentFiberWithDom.node) throw new Error("append error, dom not exist");

    const parentDom = parentFiberWithDom.node as Element;

    const currentDom = fiber.node as Element;

    if (!Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, parentDom.tagName.toLowerCase())) {
      parentDom.appendChild(currentDom);
    }

    if (fiber.patch & PATCH_TYPE.__pendingAppend__) {
      fiber.patch ^= PATCH_TYPE.__pendingAppend__;
    }
  }
};
