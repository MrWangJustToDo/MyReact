import { __my_react_internal__ } from "@my-react/react";

import type { PlainElement } from "./plain";
import type { TextElement } from "./text";
import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE } = __my_react_internal__;

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingAppend__) {
    if (!fiber.node || !parentFiberWithDom.node) throw new Error("append error");

    const parentDom = parentFiberWithDom.node as PlainElement;

    const currentDom = fiber.node as PlainElement | TextElement;

    if (currentDom) parentDom.appendChild(currentDom);

    if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;
  }
};
