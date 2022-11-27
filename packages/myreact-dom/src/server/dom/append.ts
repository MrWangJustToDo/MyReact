import { PATCH_TYPE } from "@my-react/react-shared";

import type { CommentElement, PlainElement, TextElement } from "./native";
import type { MyReactFiberNode } from "@my-react/react";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingAppend__) {
    if (!fiber.node || !parentFiberWithDom.node) throw new Error("append error");

    const parentDom = parentFiberWithDom.node as PlainElement | CommentElement;

    const currentDom = fiber.node as PlainElement | CommentElement | TextElement;

    if (currentDom) parentDom.appendChild(currentDom);

    if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;
  }
};
