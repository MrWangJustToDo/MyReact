import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "@my-react-dom-shared";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

/**
 * @internal
 */
export const position = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__position__)) {
    let { parentFiberWithNode } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

    if (!parentFiberWithNode || include(parentFiberWithNode.state, STATE_TYPE.__unmount__)) {
      parentFiberWithNode = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderDispatch.runtimeDom.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithNode;

      renderDispatch.runtimeDom.elementMap.set(fiber, elementObj);
    }

    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!parentFiberWithNode?.nativeNode && !maybeContainer?.containerNode) throw new Error(`[@my-react/react-dom] position error, current render node not have a container node`);

    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithNode);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom, parentFiberWithNode);
    } else {
      append(fiber, parentFiberWithNode);
    }
  }
};
