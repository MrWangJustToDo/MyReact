import { NODE_TYPE } from "@my-react/react-reconciler";

import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

export const hydrateCreate = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode): boolean => {
  if (fiber.type & (NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    const parentDom = (parentFiberWithDom.nativeNode || maybeContainer.containerNode) as DomElement;

    const { result } = getHydrateDom(fiber, parentDom);

    return result;
  }

  throw new Error("hydrate error, portal element can not hydrate");
};
