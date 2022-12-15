import { PATCH_TYPE } from "@my-react/react-shared";

import { deactivateFiber } from "./deactivate";

import type { MyReactFiberNode } from "@my-react/react";

export const deactivate = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingDeactivate__) {
    const globalDispatch = fiber.root.globalDispatch;

    const allDeactivateFibers = globalDispatch.keepLiveMap[fiber.uid];

    allDeactivateFibers?.forEach((fiber) => {
      if (fiber.isActivated) deactivateFiber(fiber);
    });

    if (fiber.patch & PATCH_TYPE.__pendingDeactivate__) fiber.patch ^= PATCH_TYPE.__pendingDeactivate__;
  }
};
