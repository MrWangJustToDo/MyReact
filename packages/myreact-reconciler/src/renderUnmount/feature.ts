import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { defaultInvokeUnmountList } from "../dispatchUnmount";
// import { triggerUnmount } from "../renderUpdate";
import { unmountFiberNode } from "../runtimeFiber";
import { currentTriggerFiber, fiberToDispatchMap, generateFiberToUnmountList } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: CustomRenderDispatch) => {
  // will happen when app crash
  list.listToFoot(function invokeUnmountPendingList(f) {
    defaultInvokeUnmountList(f, renderDispatch);
  });

  list.listToFoot(function invokeFiberUnmountList(f) {
    unmountFiberNode(f, renderDispatch);
  });
};

// unmount current fiber
export const unmountFiber = (fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  const list = generateFiberToUnmountList(fiber);

  unmountList(list, renderDispatch);
};

// unmount current container with safe
export const unmountContainer = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  renderDispatch.reconcileUnmount();

  cb?.();

  if (__DEV__) currentTriggerFiber.current = null;
};

export const clearContainer = (renderDispatch: CustomRenderDispatch) => {
  renderDispatch.pendingCommitFiberList?.clear();
  renderDispatch.pendingChangedFiberList?.clear();
  renderDispatch.pendingCommitFiberPatch = PATCH_TYPE.__initial__;
  renderDispatch.pendingUpdateFiberArray?.clear();
  renderDispatch.pendingAsyncLoadFiberList?.clear();
  renderDispatch.resetUpdateFlowRuntimeFiber();
  renderDispatch.isAppMounted = false;
  renderDispatch.isAppUnmounted = true;
};
