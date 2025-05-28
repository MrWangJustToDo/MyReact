import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { mountLoopAll, processAsyncLoadListOnAsyncMount, processAsyncLoadListOnSyncMount } from "../runtimeMount";
import { resetLogScope, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const mountSync = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoopAll(renderDispatch, fiber);

  processAsyncLoadListOnSyncMount(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  (function finishMount() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    renderDispatch.reconcileCommit(fiber);

    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    __DEV__ && enableScopeTreeLog.current && resetLogScope();

    changedList?.length &&
      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        },
      });
  })();

  globalLoop.current = false;
};

export const mountAsync = async (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoopAll(renderDispatch, fiber);

  await processAsyncLoadListOnAsyncMount(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  (function finishMount() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    renderDispatch.reconcileCommit(fiber);

    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    __DEV__ && enableScopeTreeLog.current && setLogScope();

    changedList?.length &&
      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        },
      });
  })();

  globalLoop.current = false;
};
