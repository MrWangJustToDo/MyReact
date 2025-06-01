import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { defaultInvokeUnmountList } from "../dispatchUnmount";
import { unmountFiberNode } from "../runtimeFiber";
import { currentTriggerFiber, generateFiberToUnmountList } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

export const unmountList = (renderDispatch: CustomRenderDispatch, list: ListTree<MyReactFiberNode>) => {
  // will happen when app crash
  list.listToFoot(function invokeUnmountPendingList(f) {
    defaultInvokeUnmountList(renderDispatch, f);
  });

  list.listToFoot(function invokeFiberUnmountList(f) {
    unmountFiberNode(renderDispatch, f);
  });
};

// unmount current fiber
export const unmountFiber = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const list = generateFiberToUnmountList(fiber);

  unmountList(renderDispatch, list);
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
  renderDispatch.pendingChangedFiberList?.clear();
  renderDispatch.resetUpdateFlowRuntimeFiber();
  renderDispatch.isAppMounted = false;
  renderDispatch.isAppUnmounted = true;
};
