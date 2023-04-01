import { createElement } from "@my-react/react";
import { Scope, Comment } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";

export const WrapperByScope = (children: MyReactElementNode) =>
  createElement(Scope, null, createElement(Comment, { mode: "s" }), children, createElement(Comment, { mode: "e" }));

export const isCommentElement = (fiber: MyReactFiberNode) => fiber.type & NODE_TYPE.__comment__;

export const isCommentStartElement = (fiber: MyReactFiberNode) => {
  if (isCommentElement(fiber)) {
    return fiber.pendingProps["mode"] === "s";
  }

  return false;
};

export const isCommentEndElement = (fiber: MyReactFiberNode) => {
  if (isCommentElement(fiber)) {
    return fiber.pendingProps["mode"] === "e";
  }

  return false;
};
