import { NODE_TYPE } from "@my-react/react-shared";

import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode } from "@my-react/react";
import type { DomElement } from "@my-react-dom-shared";

export const hydrateCreate = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode): boolean => {
  if (fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isCommentNode__)) {
    const element = parentFiberWithDom.node as DomElement;

    const { result } = getHydrateDom(fiber, element);

    return result;
  }

  throw new Error("hydrate error, portal element can not hydrate");
};