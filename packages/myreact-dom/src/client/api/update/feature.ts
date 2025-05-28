import { emptyProps, NODE_TYPE, safeCallWithCurrentFiber, type MyReactFiberNode } from "@my-react/react-reconciler";
import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { domListenersMap, type ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { validDomProps } from "@my-react-dom-shared";

import { controlElementTag, isControlledElement, isReadonlyElement } from "../helper";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";

/**
 * @internal
 */
export const update = (renderDispatch: ClientDomDispatch, fiber: MyReactFiberNode, hydrate: boolean) => {
  if (include(fiber.patch, PATCH_TYPE.__update__)) {
    if (__DEV__) validDomProps(fiber);

    if (hydrate) {
      hydrateUpdate(renderDispatch, fiber);
    } else {
      nativeUpdate(renderDispatch, fiber, fiber.memoizedProps === emptyProps);
    }

    if (__DEV__) {
      const isControlledElementNode = include(fiber.type, NODE_TYPE.__plain__) && controlElementTag[fiber.elementType as string];
      if (isControlledElementNode) {
        if (isReadonlyElement(fiber)) {
          if (fiber.nativeNode?.getAttribute("data-readonly") !== "@my-react") {
            fiber.nativeNode?.removeAttribute("data-control");
            fiber.nativeNode?.setAttribute("data-readonly", "@my-react");
          }
        } else if (isControlledElement(fiber)) {
          if (fiber.nativeNode?.getAttribute("data-control") !== "@my-react") {
            fiber.nativeNode?.removeAttribute("data-readonly");
            fiber.nativeNode?.setAttribute("data-control", "@my-react");
          }
        } else {
          fiber.nativeNode?.removeAttribute("data-control");
          fiber.nativeNode?.removeAttribute("data-readonly");
        }
      }
    }

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallPatchToCommitUpdate() {
        renderDispatch.patchToCommitUpdate?.(fiber);
      },
    });

    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallDomUpdateListener() {
        domListenersMap.get(renderDispatch)?.domUpdate?.forEach((listener) => listener(fiber));
      },
    });

    fiber.memoizedProps = fiber.pendingProps;

    if (typeof fiber.pendingText === "string") {
      fiber.memoizedText = fiber.pendingText;
    }

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__update__);
  }
};
