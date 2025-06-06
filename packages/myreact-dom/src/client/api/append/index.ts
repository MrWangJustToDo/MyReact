import { type MyReactFiberNode, type MyReactFiberContainer, safeCallWithCurrentFiber } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { domListenersMap, type ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { getValidParentFiberWithNode, isSingleTag } from "@my-react-dom-shared";

import type { DomElement, DomNode } from "@my-react-dom-shared";

/**
 * @internal
 */
export const append = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.patch, PATCH_TYPE.__append__)) {
    const parentFiberWithNode = getValidParentFiberWithNode(renderDispatch, fiber);

    const maybeContainer = parentFiberWithNode as MyReactFiberContainer;

    if (!fiber?.nativeNode) throw new Error(`[@my-react/react-dom] append error, current render node not have a native node`);

    const parentDom = (parentFiberWithNode?.nativeNode || maybeContainer?.containerNode || renderDispatch.rootNode) as DomElement;

    const currentDom = fiber.nativeNode as DomNode;

    if (parentFiberWithNode) {
      if (!isSingleTag[parentFiberWithNode.elementType as string]) {
        parentDom.appendChild(currentDom);
      } else {
        if (__DEV__) {
          console.error(`[@my-react/react-dom] append error, the parent node is a single tag node, can't append child node`);
        }
      }
    } else {
      parentDom.appendChild(currentDom);
    }

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallPatchToCommitAppend() {
        renderDispatch.patchToCommitAppend?.(fiber);
      },
    });

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallDomAppendListener() {
        domListenersMap.get(renderDispatch)?.domAppend?.forEach((listener) => listener(fiber));
      },
    });

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__append__);
  }
};
