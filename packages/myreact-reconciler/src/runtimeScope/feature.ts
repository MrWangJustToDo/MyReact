import { createElement } from "@my-react/react/type";
import { Comment, include, ScopeLazy, ScopeSuspense } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react/type";

export function WrapperByLazyScope(children: MyReactElementNode) {
  return createElement(ScopeLazy, null, children);
}

export function WrapperBySuspenseScope(children: MyReactElementNode) {
  return createElement(ScopeSuspense, null, createElement(Comment, { mode: "s" }), children, createElement(Comment, { mode: "e" }));
}

export function isCommentElement(fiber: MyReactFiberNode) {
  return include(fiber.type, NODE_TYPE.__comment__);
}

export function isCommentStartElement(fiber: MyReactFiberNode) {
  if (isCommentElement(fiber)) {
    return fiber.pendingProps["mode"] === "s";
  }

  return false;
}

export function isCommentEndElement(fiber: MyReactFiberNode) {
  if (isCommentElement(fiber)) {
    return fiber.pendingProps["mode"] === "e";
  }

  return false;
}
