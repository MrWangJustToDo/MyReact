import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { validDomProps } from "@my-react-dom-shared";

import { controlElementTag, isControlledElement, isReadonlyElement } from "../helper";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

/**
 * @internal
 */
export const update = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch, hydrate: boolean) => {
  if (include(fiber.patch, PATCH_TYPE.__update__)) {
    if (__DEV__) validDomProps(fiber);

    if (hydrate) {
      hydrateUpdate(fiber, renderDispatch);
    } else {
      nativeUpdate(fiber, renderDispatch);
    }

    if (__DEV__) {
      const isControlledElementNode = controlElementTag[fiber.elementType as string];
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

    fiber.memoizedProps = fiber.pendingProps;

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__update__);
  }
};
