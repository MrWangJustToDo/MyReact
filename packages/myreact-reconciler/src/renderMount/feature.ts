import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { type CustomRenderDispatch } from "../renderDispatch";
import { mountLoopAll, processAsyncLoadListOnAsyncMount, processAsyncLoadListOnSyncMount } from "../runtimeMount";
import { resetLogScope, safeCall, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

function finishMountSync(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
  __DEV__ && enableScopeTreeLog.current && setLogScope();

  renderDispatch.reconcileCommit(fiber);

  const changedList = renderDispatch.pendingChangedFiberList;

  renderDispatch.resetUpdateFlowRuntimeFiber();

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.pendingChangedFiberList = null;

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  changedList?.length &&
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFiberHasChangeListener() {
        renderDispatch.callOnFiberChange(changedList);
      },
    });
}

export const mountSync = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  __DEV__ &&
    safeCall(function safeCallBeforeDispatchRender() {
      renderDispatch.callOnBeforeDispatchRender(renderDispatch, fiber);
    });

  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoopAll(renderDispatch, fiber);

  processAsyncLoadListOnSyncMount(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  finishMountSync(renderDispatch, fiber);

  __DEV__ &&
    safeCall(function safeCallAfterDispatchRender() {
      renderDispatch.callOnAfterDispatchRender(renderDispatch);
    });

  globalLoop.current = false;
};

function finishMountAsync(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
  __DEV__ && enableScopeTreeLog.current && setLogScope();

  renderDispatch.reconcileCommit(fiber);

  const changedList = renderDispatch.pendingChangedFiberList;

  renderDispatch.resetUpdateFlowRuntimeFiber();

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.pendingChangedFiberList = null;

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  changedList?.length &&
    safeCallWithCurrentFiber({
      fiber,
      action: function safeCallFiberHasChangeListener() {
        renderDispatch.callOnFiberChange(changedList);
      },
    });
}

export const mountAsync = async (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
  __DEV__ &&
    safeCall(function safeCallBeforeDispatchRender() {
      renderDispatch.callOnBeforeDispatchRender(renderDispatch, fiber);
    });

  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoopAll(renderDispatch, fiber);

  await processAsyncLoadListOnAsyncMount(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  finishMountAsync(renderDispatch, fiber);

  __DEV__ &&
    safeCall(function safeCallAfterDispatchRender() {
      renderDispatch.callOnAfterDispatchRender(renderDispatch);
    });

  globalLoop.current = false;
};
