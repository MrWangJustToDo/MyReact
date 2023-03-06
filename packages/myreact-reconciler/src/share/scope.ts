import { createElement } from "@my-react/react";
import { NODE_TYPE, Scope, Comment } from "@my-react/react-shared";

import type { MyReactFiberNodeDev } from "../fiber";
import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const WrapperByScope = (children: MyReactElementNode) =>
  createElement(Scope, null, createElement(Comment, { mode: "s" }), children, createElement(Comment, { mode: "e" }));

export const isCommentElement = (fiber: MyReactFiberNode) => fiber.type & NODE_TYPE.__isCommentNode__;

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

export const defaultGenerateScopeMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode>) => {
  const parent = fiber.parent;

  if (parent) {
    if (parent.type & NODE_TYPE.__isScopeNode__) {
      map.set(fiber, parent);
    } else {
      const parentScopeFiber = map.get(parent);

      parentScopeFiber && map.set(fiber, parentScopeFiber);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const scopeFiber = map.get(fiber);

    scopeFiber && (typedFiber._debugScope = scopeFiber);
  }
};
