import { PATCH_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNodeDev } from "./interface";
import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode } from "@my-react/react";

// just used for rootFiber
export const initialFiberNode = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  if (fiber.ref) {
    renderDispatch.pendingRef(fiber);
  }

  renderPlatform.patchToFiberInitial?.(fiber);

  if (!(fiber.patch & PATCH_TYPE.__pendingUpdate__)) {
    fiber._applyProps();
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const timeNow = Date.now();

    typedFiber._debugRenderState = {
      renderCount: 1,
      mountTime: timeNow,
      prevUpdateTime: 0,
      currentUpdateTime: timeNow,
    };
  }

  return fiber;
};
