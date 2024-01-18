import { STATE_TYPE, include } from "@my-react/react-shared";

import { unmount } from "../dispatchUnmount";
import { triggerUnmount } from "../renderUpdate";
import { unmountFiberNode } from "../runtimeFiber";
import { fiberToDispatchMap, generateFiberToList, safeCallWithFiber } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { ListTree } from "@my-react/react-shared";

export const unmountList = (list: ListTree<MyReactFiberNode>, renderDispatch: CustomRenderDispatch) => {
  list.listToFoot((f) => safeCallWithFiber({ fiber: f, action: () => f._unmount() }));

  // will happen when app crash
  list.listToFoot((f) => unmount(f, renderDispatch));

  list.listToFoot((f) => unmountFiberNode(f, renderDispatch));
};

// unmount current fiber
export const unmountFiber = (fiber: MyReactFiberNode) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  const list = generateFiberToList(fiber);

  unmountList(list, renderDispatch);
};

// unmount current container
export const unmountContainer = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  const rootFiber = renderDispatch.rootFiber;

  triggerUnmount(rootFiber, () => {
    renderDispatch.pendingCommitFiberList.clear();
    renderDispatch.pendingUpdateFiberArray.clear();
    renderDispatch.pendingAsyncLoadFiberList.clear();
    renderDispatch.resetUpdateFlowRuntimeFiber();
    renderDispatch.isAppMounted = false;
    renderDispatch.isAppUnmounted = true;
    cb?.();
  });
};
