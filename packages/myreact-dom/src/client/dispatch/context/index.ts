import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingContext__) {
    const allListeners = fiber.dependence.slice(0);

    Promise.resolve().then(() => {
      new Set(allListeners).forEach((i) => {
        const fiber = i._ownerFiber;
        if (fiber?.mount) fiber.update();
      });
    });

    if (fiber.patch & PATCH_TYPE.__pendingContext__) fiber.patch ^= PATCH_TYPE.__pendingContext__;
  }
};
