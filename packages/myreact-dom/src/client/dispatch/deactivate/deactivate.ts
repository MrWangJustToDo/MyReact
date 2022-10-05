import { PATCH_TYPE } from "@my-react/react-shared";

import { unmountFiber } from "../unmount";

import type { MyReactFiberNode } from "@my-react/react";

export const deactivate = (fiber: MyReactFiberNode) => {
  if (fiber.patch & PATCH_TYPE.__pendingDeactivate__) {
    const globalDispatch = fiber.root.dispatch;

    const allDeactivateFibers = globalDispatch.keepLiveMap[fiber.uid];

    allDeactivateFibers?.forEach((fiber) => {
      if (fiber.mount) unmountFiber(fiber);
    });

    if (fiber.patch & PATCH_TYPE.__pendingDeactivate__) fiber.type ^= PATCH_TYPE.__pendingDeactivate__;
  }
};
