import { PATCH_TYPE } from "@my-react/react-shared";

import { fiberToDispatchMap } from "../share";

import type { MyReactFiberNode } from "./instance";
import type { MyReactFiberNodeDev } from "./interface";
import type { CustomRenderDispatch } from "../renderDispatch";

// no need to resolve map for this fiber, this code only used for fiberRoot init
export const initialFiberNode = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  fiberToDispatchMap.set(fiber, renderDispatch);

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  renderDispatch.pendingRef(fiber);

  renderDispatch.patchToFiberInitial?.(fiber);

  if (!(fiber.patch & PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
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
