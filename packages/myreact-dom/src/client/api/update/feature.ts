import { PATCH_TYPE } from "@my-react/react-shared";

import { validDomProps } from "@my-react-dom-shared";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";

export const update = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch, hydrate: boolean) => {
  if (fiber.patch & PATCH_TYPE.__update__) {
    if (__DEV__) validDomProps(fiber);

    if (hydrate) {
      hydrateUpdate(fiber, renderDispatch);
    } else {
      nativeUpdate(fiber, renderDispatch);
    }

    fiber.memoizedProps = fiber.pendingProps;

    if (fiber.patch & PATCH_TYPE.__update__) fiber.patch ^= PATCH_TYPE.__update__;
  }
};
