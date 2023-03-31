import { PATCH_TYPE } from "@my-react/react-shared";

import { hydrateUpdate } from "./hydrateUpdate";
import { nativeUpdate } from "./nativeUpdate";
import { validDomProps } from "./validDomProps";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const update = (fiber: MyReactFiberNode, hydrate: boolean, isSVG: boolean) => {
  if (fiber.patch & PATCH_TYPE.__update__) {
    if (__DEV__) validDomProps(fiber);

    if (hydrate) {
      hydrateUpdate(fiber, isSVG);
    } else {
      nativeUpdate(fiber, isSVG);
    }

    fiber.memoizedProps = fiber.pendingProps;

    if (fiber.patch & PATCH_TYPE.__update__) fiber.patch ^= PATCH_TYPE.__update__;
  }
};
