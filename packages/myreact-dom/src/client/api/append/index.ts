import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { getFiberWithNativeDom, isSingleTag } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

export const append = (fiber: MyReactFiberNode, parentFiberWithDom?: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__append__) {
    const renderContainer = fiber.renderContainer;

    const renderDispatch = renderContainer.renderDispatch as ClientDomDispatch;

    // will happen on HMR
    if (!parentFiberWithDom || parentFiberWithDom.state & STATE_TYPE.__unmount__) {
      parentFiberWithDom = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderDispatch.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithDom;

      renderDispatch.elementMap.set(fiber, elementObj);
    }

    const maybeContainer = parentFiberWithDom as MyReactFiberContainer;

    if (!fiber?.nativeNode) throw new Error(`append error, current render node not have a native node`);

    if (!parentFiberWithDom?.nativeNode && !maybeContainer?.containerNode) {
      throw new Error(`append error, current render node not have a container native node`);
    }

    const parentDom = (parentFiberWithDom.nativeNode || maybeContainer.containerNode) as DomElement;

    const currentDom = fiber.nativeNode as DomNode;

    if (!isSingleTag[parentFiberWithDom.elementType as string]) {
      parentDom.appendChild(currentDom);
    }

    if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;
  }
};
