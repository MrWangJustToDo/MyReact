import { PATCH_TYPE } from "@my-react/react-shared";

import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";

export const setRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.patch & PATCH_TYPE.__pendingRef__) {
    const renderPlatform = _fiber.root.renderPlatform as RenderPlatform;

    renderPlatform.setRef(_fiber);

    if (_fiber.patch & PATCH_TYPE.__pendingRef__) _fiber.patch ^= PATCH_TYPE.__pendingRef__;
  }
};

export const unsetRef = (_fiber: MyReactFiberNode) => {
  const renderPlatform = _fiber.root.renderPlatform as RenderPlatform;

  renderPlatform.unsetRef(_fiber);
};
