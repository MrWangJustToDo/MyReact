import { NODE_TYPE } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { getHydrateDom } from "./getHydrateDom";

import type { MyReactFiberNode, MyReactFiberContainer, CustomRenderDispatch } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

/**
 * @internal
 */
export const hydrateCreate = (fiber: MyReactFiberNode, parentItemWithDom: MyReactFiberNode | CustomRenderDispatch, previousDom: ChildNode | null): boolean => {
  if (include(fiber.type, NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__)) {
    const maybeContainer = parentItemWithDom as MyReactFiberContainer;

    const maybeDispatch = parentItemWithDom as CustomRenderDispatch;

    const maybeFiber = parentItemWithDom as MyReactFiberNode;

    const parentDom = (maybeFiber?.nativeNode || maybeContainer?.containerNode || maybeDispatch.rootNode) as DomElement;

    if (!parentDom) throw new Error("[@my-react/react-dom] hydrate error, parent dom not found");

    const result = getHydrateDom(fiber, parentDom, previousDom);

    return Boolean(result);
  }

  return false;

  // throw new Error("[@my-react/react-dom] hydrate error, portal element can not hydrate");
};
