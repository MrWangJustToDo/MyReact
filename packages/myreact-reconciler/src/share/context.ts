import { PATCH_TYPE } from "@my-react/react-shared";

import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingContext__) {
    const set = new Set(fiber.dependence);

    const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

    renderPlatform.microTask(() => set.forEach((i) => i._ownerFiber?._update()));

    if (fiber.patch & PATCH_TYPE.__pendingContext__) fiber.patch ^= PATCH_TYPE.__pendingContext__;
  }
};
