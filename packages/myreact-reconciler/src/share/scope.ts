import { createElement, Scope, Comment } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactElementNode, MyReactFiberNode, MyReactElement } from "@my-react/react";

export const WrapperByScope = (children: MyReactElementNode) =>
  createElement(Scope, null, createElement(Comment, { mode: "s" }), children, createElement(Comment, { mode: "e" }));

export const isCommentElement = (fiber: MyReactFiberNode) => fiber.type & NODE_TYPE.__isCommentNode__;

export const isCommentStartElement = (fiber: MyReactFiberNode) => {
  if (isCommentElement(fiber)) {
    const typedElement = fiber.element as MyReactElement;

    return typedElement.props["mode"] === "s";
  }

  return false;
};

export const isCommentEndElement = (fiber: MyReactFiberNode) => {
  if (isCommentElement(fiber)) {
    const typedElement = fiber.element as MyReactElement;

    return typedElement.props["mode"] === "e";
  }

  return false;
};
