import { PATCH_TYPE } from "@my-react/react-shared";

import { getFiberWithNativeDom } from "@my-react-dom-shared";

import { append } from "./append";
import { getInsertBeforeDomFromSiblingAndParent } from "./getInsertBeforeDom";
import { insertBefore } from "./insertBefore";

import type { MyReactFiberNode } from "@my-react/react";
import type { ClientDomPlatform } from "@my-react-dom-client";

export const position = (fiber: MyReactFiberNode, parentFiberWithDom: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingPosition__) {
    const renderPlatform = fiber.root.renderPlatform as ClientDomPlatform;

    if (!parentFiberWithDom.isMounted) {
      parentFiberWithDom = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderPlatform.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithDom;

      renderPlatform.elementMap.set(fiber, elementObj);
    }

    if (!parentFiberWithDom?.node) throw new Error("position error, dom not exist");

    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(fiber, parentFiberWithDom);

    if (beforeFiberWithDom) {
      insertBefore(fiber, beforeFiberWithDom, parentFiberWithDom);
    } else {
      append(fiber, parentFiberWithDom);
    }

    if (fiber.patch & PATCH_TYPE.__pendingPosition__) fiber.patch ^= PATCH_TYPE.__pendingPosition__;
  }
};
