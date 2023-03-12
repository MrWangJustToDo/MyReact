import { isCommentStartElement, NODE_TYPE } from "@my-react/react-reconciler";
import { PATCH_TYPE } from "@my-react/react-shared";

import { CommentEndElement, CommentStartElement, PlainElement, TextElement } from "./native";

import type { MyReactFiberNode } from "@my-react/react";

export const create = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingCreate__) {
    if (fiber.type & NODE_TYPE.__isTextNode__) {
      fiber.node = new TextElement(fiber.element as string);
    } else if (fiber.type & NODE_TYPE.__isPlainNode__) {
      const typedElementType = fiber.elementType as string;

      fiber.node = new PlainElement(typedElementType);
    } else if (fiber.type & NODE_TYPE.__isCommentNode__) {
      if (isCommentStartElement(fiber)) {
        fiber.node = new CommentStartElement();
      } else {
        fiber.node = new CommentEndElement();
      }
    } else {
      throw new Error("createPortal() can not call on the server");
    }

    if (fiber.patch & PATCH_TYPE.__pendingCreate__) fiber.patch ^= PATCH_TYPE.__pendingCreate__;
  }
};
