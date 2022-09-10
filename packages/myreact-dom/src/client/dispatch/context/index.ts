import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { PATCH_TYPE } = __my_react_internal__;

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingContext__) {
    const allListeners = fiber.dependence.slice(0);
    Promise.resolve().then(() => {
      allListeners.map((i) => i._ownerFiber).forEach((f) => f?.mount && f.update());
    });
    if (fiber.patch & PATCH_TYPE.__pendingContext__) {
      fiber.patch ^= PATCH_TYPE.__pendingContext__;
    }
  }
};
