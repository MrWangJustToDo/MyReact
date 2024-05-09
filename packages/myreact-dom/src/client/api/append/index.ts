import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { getValidParentFiberWithNode, isSingleTag } from "@my-react-dom-shared";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { DomElement, DomNode } from "@my-react-dom-shared";

/**
 * @internal
 */
export const append = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch) => {
  if (include(fiber.patch, PATCH_TYPE.__append__)) {
    const parentFiberWithNode = getValidParentFiberWithNode(fiber, renderDispatch);

    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!fiber?.nativeNode) throw new Error(`[@my-react/react-dom] append error, current render node not have a native node`);

    if (!parentFiberWithNode?.nativeNode && !maybeContainer?.containerNode) {
      throw new Error(`[@my-react/react-dom] append error, current render node not have a container native node`);
    }

    const parentDom = (parentFiberWithNode.nativeNode || maybeContainer.containerNode) as DomElement;

    const currentDom = fiber.nativeNode as DomNode;

    if (!isSingleTag[parentFiberWithNode.elementType as string]) {
      parentDom.appendChild(currentDom);
    }

    renderDispatch.patchToCommitAppend?.(fiber);

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);
  }
};
