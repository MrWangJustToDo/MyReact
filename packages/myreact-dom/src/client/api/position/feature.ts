import { PATCH_TYPE, exclude, include } from "@my-react/react-shared";

import { getValidParentFiberWithNode } from "@my-react-dom-shared";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

/**
 * @internal
 */
export const position = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__position__)) {
    const rootFiber = renderDispatch.rootFiber;

    const parentFiberWithNode = getValidParentFiberWithNode(fiber, renderDispatch);

    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithNode || rootFiber);

    // check is the beforeFiberWithDom is a stable node
    if (beforeFiberWithDom && exclude(beforeFiberWithDom.patch, PATCH_TYPE.__append__ | PATCH_TYPE.__position__)) {
      insertBefore(fiber, beforeFiberWithDom, parentFiberWithNode || renderDispatch);
    } else {
      append(fiber, parentFiberWithNode || renderDispatch);
    }
  }
};
