import { PATCH_TYPE } from "@my-react/react-shared";

import { IS_SINGLE_ELEMENT, getFiberWithNativeDom } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react";
import type { ClientDomPlatform } from "@my-react-dom-client";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom?: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingAppend__) {
    const renderPlatform = fiber.root.renderPlatform as ClientDomPlatform;

    // will never happen
    if (!parentFiberWithDom.isMounted) {
      parentFiberWithDom = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderPlatform.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithDom;

      renderPlatform.elementMap.set(fiber, elementObj);
    }

    if (!fiber.node || !parentFiberWithDom.node) throw new Error("append error, dom not exist");

    const parentDom = parentFiberWithDom.node as DomElement;

    const currentDom = fiber.node as DomNode;

    if (!Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, parentDom.tagName.toLowerCase())) {
      parentDom.appendChild(currentDom);
    }

    if (fiber.patch & PATCH_TYPE.__pendingAppend__) fiber.patch ^= PATCH_TYPE.__pendingAppend__;
  }
};
