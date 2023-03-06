import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingContext__) {
    const set = new Set(fiber.dependence);

    Promise.resolve().then(() => {
      set.forEach((i) => {
        const fiber = i._ownerFiber;

        if (fiber?.isMounted) fiber.update();
      });
    });

    if (fiber.patch & PATCH_TYPE.__pendingContext__) fiber.patch ^= PATCH_TYPE.__pendingContext__;
  }
};
