import { NODE_TYPE } from "@my-react/react-reconciler";

import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

export const hydrateCreate = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode): boolean => {
  if (fiber.type & (NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__)) {
    const parentDom = parentFiberWithDom.nativeNode as DomElement;

    const { result } = getHydrateDom(fiber, parentDom);

    return result;
  }

  throw new Error("hydrate error, portal element can not hydrate");
};
