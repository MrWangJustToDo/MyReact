import { __my_react_internal__ } from "@my-react/react";

import { PlainElement } from "./plain";
import { TextElement } from "./text";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE, NODE_TYPE } = __my_react_internal__;

export const create = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingCreate__) {
    if (fiber.type & NODE_TYPE.__isTextNode__) {
      fiber.node = new TextElement(fiber.element as string);
    } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
      const typedElement = fiber.element as MyReactElement;
      fiber.node = new PlainElement(typedElement.type as string);
    } else {
      throw new Error("createPortal() can not call on the server");
    }

    if (fiber.patch & PATCH_TYPE.__pendingCreate__) fiber.patch ^= PATCH_TYPE.__pendingCreate__;
  }
};
