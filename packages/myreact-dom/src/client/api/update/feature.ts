import { PATCH_TYPE, include, remove } from "@my-react/react-shared";

import { validDomProps } from "@my-react-dom-shared";

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

    fiber.memoizedProps = fiber.pendingProps;

    fiber.patch = remove(fiber.patch, PATCH_TYPE.__update__);
  }
};
