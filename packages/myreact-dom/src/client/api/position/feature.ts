import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "@my-react-dom-shared";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

export const position = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__position__) {
    const renderContainer = fiber.renderContainer;

    const renderDispatch = renderContainer.renderDispatch as ClientDomDispatch;

    if (!parentFiberWithDom || parentFiberWithDom.state & STATE_TYPE.__unmount__) {
      parentFiberWithDom = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderDispatch.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithDom;

      renderDispatch.elementMap.set(fiber, elementObj);
    }

    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    if (!parentFiberWithDom?.nativeNode && !maybeContainer?.containerNode) throw new Error(`position error, current render node not have a container node`);

    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom, parentFiberWithDom);
    } else {
      append(fiber, parentFiberWithDom);
    }

    if (fiber.patch & PATCH_TYPE.__position__) fiber.patch ^= PATCH_TYPE.__position__;
  }
};
