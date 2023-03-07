import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingContext__) {
    const set = new Set(fiber.dependence);

    set.forEach((i) => i._ownerFiber?._update());

    if (fiber.patch & PATCH_TYPE.__pendingContext__) fiber.patch ^= PATCH_TYPE.__pendingContext__;
  }
};
