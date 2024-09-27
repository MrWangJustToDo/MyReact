import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { updateLoopConcurrentFromRoot, updateLoopConcurrentFromTrigger, updateLoopSyncFromRoot, updateLoopSyncFromTrigger } from "../runtimeUpdate";
import { resetLogScope, safeCall, setLogScope } from "../share";

import { scheduleNext } from "./trigger";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const updateSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopSyncFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  (function finishUpdateSyncFromRoot() {
    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    changedList?.length &&
      safeCall(function safeCallFiberHasChangeListener() {
        listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
      });
  })();

  renderPlatform.microTask(function callScheduleNext() {
    globalLoop.current = false;

    scheduleNext(renderDispatch);
  });
};

export const updateSyncFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopSyncFromTrigger(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  (function finishUpdateSyncFromTrigger() {
    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    changedList?.length &&
      safeCall(function safeCallFiberHasChangeListener() {
        listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
      });
  })();

  renderPlatform.microTask(function callScheduleNext() {
    globalLoop.current = false;

    scheduleNext(renderDispatch);
  });
};

export const updateConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopConcurrentFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderPlatform.yieldTask(function resumeUpdateConcurrentFromRoot() {
      updateConcurrentFromRoot(renderDispatch);
    });
  } else {
    (function finishUpdateConcurrentFromRoot() {
      const commitList = renderDispatch.pendingCommitFiberList;

      const changedList = renderDispatch.pendingChangedFiberList;

      renderDispatch.resetUpdateFlowRuntimeFiber();

      renderDispatch.pendingCommitFiberList = null;

      renderDispatch.pendingChangedFiberList = null;

      commitList?.length && renderDispatch.reconcileUpdate(commitList);

      changedList?.length &&
        safeCall(function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        });
    })();

    renderPlatform.microTask(function callScheduleNext() {
      // TODO! flash all effect
      globalLoop.current = false;

      scheduleNext(renderDispatch);
    });
  }
};

export const updateConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopConcurrentFromTrigger(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderPlatform.yieldTask(function resumeUpdateConcurrentFromTrigger() {
      updateConcurrentFromTrigger(renderDispatch);
    });
  } else {
    (function finishUpdateConcurrentFromTrigger() {
      const commitList = renderDispatch.pendingCommitFiberList;

      const changedList = renderDispatch.pendingChangedFiberList;

      renderDispatch.resetUpdateFlowRuntimeFiber();

      renderDispatch.pendingCommitFiberList = null;

      renderDispatch.pendingChangedFiberList = null;

      commitList?.length && renderDispatch.reconcileUpdate(commitList);

      changedList?.length &&
        safeCall(function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        });
    })();

    renderPlatform.microTask(function callScheduleNext() {
      // TODO! flash all effect
      globalLoop.current = false;

      scheduleNext(renderDispatch);
    });
  }
};
