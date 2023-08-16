import { PATCH_TYPE, STATE_TYPE } from "@my-react/react-shared";

import { getFiberWithNativeDom, isSingleTag } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

/**
 * @internal
 */
export const append = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (fiber.patch & PATCH_TYPE.__append__) {
    let { parentFiberWithNode } = renderDispatch.runtimeDom.elementMap.get(fiber) || {};

    if (!parentFiberWithNode || parentFiberWithNode.state & STATE_TYPE.__unmount__) {
      parentFiberWithNode = getFiberWithNativeDom(fiber.parent, (f) => f.parent) as MyReactFiberNode;

      const elementObj = renderDispatch.runtimeDom.elementMap.get(fiber);

      elementObj.parentFiberWithNode = parentFiberWithNode;

      renderDispatch.runtimeDom.elementMap.set(fiber, elementObj);
    }

    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!fiber?.nativeNode) throw new Error(`append error, current render node not have a native node`);

    if (!parentFiberWithNode?.nativeNode && !maybeContainer?.containerNode) {
      throw new Error(`append error, current render node not have a container native node`);
    }

    const parentDom = (parentFiberWithNode.nativeNode || maybeContainer.containerNode) as DomElement;

    const currentDom = fiber.nativeNode as DomNode;

    if (!isSingleTag[parentFiberWithNode.elementType as string]) {
      parentDom.appendChild(currentDom);
    }

    if (fiber.patch & PATCH_TYPE.__append__) fiber.patch ^= PATCH_TYPE.__append__;
  }
};
