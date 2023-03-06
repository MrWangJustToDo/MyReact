import { PATCH_TYPE } from "@my-react/react-shared";

import { debugWithDOM } from "@my-react-dom-shared";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";

import type { MyReactFiberNode } from "@my-react/react";

export const update = (fiber: MyReactFiberNode, hydrate: boolean, isSVG: boolean) => {
  if (fiber.patch & PATCH_TYPE.__pendingUpdate__) {
    if (hydrate) {
      hydrateUpdate(fiber, isSVG);
    } else {
      nativeUpdate(fiber, isSVG);
    }

    if (__DEV__) {
      debugWithDOM(fiber);
    }

    fiber.applyProps();

    if (fiber.patch & PATCH_TYPE.__pendingUpdate__) fiber.patch ^= PATCH_TYPE.__pendingUpdate__;
  }
};
