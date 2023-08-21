import { NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

export const hydrateCreate = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode, previousDom: ChildNode | null): boolean => {
  if (include(fiber.type, NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    const parentDom = (parentFiberWithDom.nativeNode || maybeContainer.containerNode) as DomElement;

    const result = getHydrateDom(fiber, parentDom, previousDom);

    return Boolean(result);
  }

  throw new Error("[@my-react/react-dom] hydrate error, portal element can not hydrate");
};
