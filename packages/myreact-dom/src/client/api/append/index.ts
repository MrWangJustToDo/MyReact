import { PATCH_TYPE } from "@my-react/react-shared";

import { IS_SINGLE_ELEMENT, getFiberWithNativeDom } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom?: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__append__) {
    const renderContainer = fiber.container;

    const renderDispatch = renderContainer.renderDispatch as ClientDomDispatch;

    // will never happen
    if (!parentFiberWithDom?.isMounted) {
      parentFiberWithDom = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderDispatch.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithDom;

      renderDispatch.elementMap.set(fiber, elementObj);
    }

    if (!fiber.nativeNode || !parentFiberWithDom.nativeNode) throw new Error("append error, dom not exist");

    const parentDom = parentFiberWithDom.nativeNode as DomElement;

    const currentDom = fiber.nativeNode as DomNode;

    if (!Object.prototype.hasOwnProperty.call(IS_SINGLE_ELEMENT, parentDom.tagName.toLowerCase())) {
      parentDom.appendChild(currentDom);
    }

    if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;
  }
};
