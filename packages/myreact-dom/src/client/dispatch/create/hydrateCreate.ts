import { __my_react_internal__ } from "@my-react/react";

import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const hydrateCreate = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode): boolean => {
  if (fiber.type & (NODE_TYPE.__isTextNode__ | NODE_TYPE.__isPlainNode__)) {
    const { result } = getHydrateDom(fiber, parentFiberWithDom.node as Element);

    return result;
  }

  throw new Error("hydrate error, portal element can not hydrate");
};
