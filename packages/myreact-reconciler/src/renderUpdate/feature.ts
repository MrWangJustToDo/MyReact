import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { processAsyncLoadListOnUpdate, updateLoopConcurrentFromRoot, updateLoopSyncFromRoot } from "../runtimeUpdate";
import { resetLogScope, safeCall, setLogScope } from "../share";

import { scheduleNext } from "./schedule";

const { globalLoop, currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const updateSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderScheduler = currentScheduler.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopSyncFromRoot(renderDispatch);

  processAsyncLoadListOnUpdate(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  (function finishUpdateSyncFromRoot() {
    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    __DEV__ && enableScopeTreeLog.current && setLogScope();

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    __DEV__ && enableScopeTreeLog.current && resetLogScope();

    changedList?.length &&
      safeCall(function safeCallFiberHasChangeListener() {
        listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
      });
  })();

  renderScheduler.microTask(function callScheduleNext() {
    globalLoop.current = false;

    scheduleNext(renderDispatch);
  });
};

export const updateConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderScheduler = currentScheduler.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopConcurrentFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderScheduler.yieldTask(function resumeUpdateConcurrentFromRoot() {
      updateConcurrentFromRoot(renderDispatch);
    });
  } else {
    processAsyncLoadListOnUpdate(renderDispatch);

    (function finishUpdateConcurrentFromRoot() {
      const commitList = renderDispatch.pendingCommitFiberList;

      const changedList = renderDispatch.pendingChangedFiberList;

      renderDispatch.resetUpdateFlowRuntimeFiber();

      renderDispatch.pendingCommitFiberList = null;

      renderDispatch.pendingChangedFiberList = null;

      __DEV__ && enableScopeTreeLog.current && setLogScope();

      commitList?.length && renderDispatch.reconcileUpdate(commitList);

      __DEV__ && enableScopeTreeLog.current && setLogScope();

      changedList?.length &&
        safeCall(function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        });
    })();

    renderScheduler.microTask(function callScheduleNext() {
      // TODO! flash all effect
      globalLoop.current = false;

      scheduleNext(renderDispatch);
    });
  }
};
