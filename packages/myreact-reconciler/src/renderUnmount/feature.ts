import { PATCH_TYPE, STATE_TYPE, include } from "@my-react/react-shared";

import { unmountPending } from "../dispatchUnmount";
import { triggerUnmount } from "../renderUpdate";
import { unmountFiberNode } from "../runtimeFiber";
import { fiberToDispatchMap, generateFiberToUnmountList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: CustomRenderDispatch) => {
  // will happen when app crash
  list.listToFoot((f) => unmountPending(f, renderDispatch));

  list.listToFoot((f) =>
    safeCallWithFiber({
      fiber: f,
      action: () => {
        f._unmount();
        unmountFiberNode(f, renderDispatch);
      },
    })
  );
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
  const rootFiber = renderDispatch.rootFiber;

  triggerUnmount(rootFiber, cb);
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
