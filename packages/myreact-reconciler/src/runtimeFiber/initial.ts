import { PATCH_TYPE, exclude } from "@my-react/react-shared";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { fiberToDispatchMap, safeCallWithCurrentFiber } from "../share";

import type { MyReactFiberNode } from "./instance";

// no need to resolve map for this fiber, this code only used for fiberRoot init
export const initialFiberNode = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  fiberToDispatchMap.set(fiber, renderDispatch);

  renderDispatch.pendingCreate(fiber);

  renderDispatch.pendingUpdate(fiber);

  renderDispatch.pendingAppend(fiber);

  renderDispatch.pendingRef(fiber);

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallPatchToFiberInitial() {
      renderDispatch.patchToFiberInitial?.(fiber);
    },
  });

  safeCallWithCurrentFiber({
    fiber,
    action: function safeCallFiberInitialListener() {
      listenerMap.get(renderDispatch)?.fiberInitial?.forEach((listener) => listener(fiber));
    },
  });

  if (exclude(fiber.patch, PATCH_TYPE.__update__)) {
    fiber.memoizedProps = fiber.pendingProps;
  }
  return fiber;
};
