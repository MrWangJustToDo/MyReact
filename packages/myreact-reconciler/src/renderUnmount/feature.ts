import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { defaultInvokeUnmountList } from "../dispatchUnmount";
import { unmountFiberNode } from "../runtimeFiber";
import { currentTriggerFiber, generateFiberToListWithAction } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

// unmount current fiber
export const unmountFiber = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const list = generateFiberToListWithAction(fiber, function invokeUnmountPending(f) {
    defaultInvokeUnmountList(renderDispatch, f);
  });

  list.listToFoot(function invokeFiberUnmountList(f) {
    unmountFiberNode(renderDispatch, f);
  });
};

// unmount current container with safe
export const unmountContainer = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  renderDispatch.reconcileUnmount();

  cb?.();

  if (__DEV__) currentTriggerFiber.current = null;
};

export const clearContainer = (renderDispatch: CustomRenderDispatch) => {
  renderDispatch.pendingCommitFiberPatch = PATCH_TYPE.__initial__;
  renderDispatch.pendingUpdateFiberArray?.clear();
  renderDispatch.pendingSuspenseFiberArray?.clear();
  renderDispatch.pendingCommitFiberList?.clear();
  renderDispatch.resetUpdateFlowRuntimeFiber();
  renderDispatch.isAppMounted = false;
  renderDispatch.isAppUnmounted = true;
};
