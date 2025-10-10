import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { processAsyncLoadListOnUpdate, updateLoopConcurrentFromRoot, updateLoopSyncFromRoot } from "../runtimeUpdate";
import { resetLogScope, safeCall, setLogScope } from "../share";

import { scheduleNext } from "./schedule";

const { globalLoop, currentScheduler } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

function finishUpdateSyncFromRoot(renderDispatch: CustomRenderDispatch) {
  const commitList = renderDispatch.pendingCommitFiberList;

  const changedList = renderDispatch.pendingChangedFiberList;

  renderDispatch.resetUpdateFlowRuntimeFiber();

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.pendingChangedFiberList = null;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  commitList?.length && renderDispatch.reconcileUpdate(commitList, true);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  __DEV__ && listenerMap.get(renderDispatch)?.afterDispatchUpdate?.forEach((cb) => cb(renderDispatch));

  changedList?.length &&
    safeCall(function safeCallFiberHasChangeListener() {
      listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
    });
}

export const updateSyncFromRoot = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderScheduler = currentScheduler.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopSyncFromRoot(renderDispatch);

  processAsyncLoadListOnUpdate(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  finishUpdateSyncFromRoot(renderDispatch);

  renderScheduler.microTask(function callScheduleNext() {
    globalLoop.current = false;

    scheduleNext(renderDispatch);
  });
};

function finishUpdateConcurrentFromRoot(renderDispatch: CustomRenderDispatch) {
  const commitList = renderDispatch.pendingCommitFiberList;

  const changedList = renderDispatch.pendingChangedFiberList;

  renderDispatch.resetUpdateFlowRuntimeFiber();

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.pendingChangedFiberList = null;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  commitList?.length && renderDispatch.reconcileUpdate(commitList);

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  __DEV__ && listenerMap.get(renderDispatch)?.afterDispatchUpdate?.forEach((cb) => cb(renderDispatch));

  changedList?.length &&
    safeCall(function safeCallFiberHasChangeListener() {
      listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
    });
}

function checkNextFiberIsSync(renderDispatch: CustomRenderDispatch) {
  return include(renderDispatch.runtimeFiber.nextWorkingFiber.state, STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__);
  // include(renderDispatch.runtimeFiber.nextWorkingFiber.state, STATE_TYPE.__retrigger__)
}

function updateConcurrentNextFrame(renderDispatch: CustomRenderDispatch) {
  const renderScheduler = currentScheduler.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  const hasSync = updateLoopConcurrentFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    if (hasSync || checkNextFiberIsSync(renderDispatch)) {
      updateSyncFromRoot(renderDispatch);
    } else {
      renderScheduler.yieldTask(function resumeUpdateConcurrentFromRoot() {
        if (hasSync || checkNextFiberIsSync(renderDispatch)) {
          updateSyncFromRoot(renderDispatch);
        } else {
          updateConcurrentNextFrame(renderDispatch);
        }
      });
    }
  } else {
    processAsyncLoadListOnUpdate(renderDispatch);

    finishUpdateConcurrentFromRoot(renderDispatch);

    renderScheduler.microTask(function callScheduleNext() {
      globalLoop.current = false;

      scheduleNext(renderDispatch);
    });
  }
}

export const updateConcurrentFromRoot = (renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  const renderScheduler = currentScheduler.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  const hasSync = updateLoopConcurrentFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    if (hasSync || checkNextFiberIsSync(renderDispatch)) {
      updateSyncFromRoot(renderDispatch);
    } else {
      renderScheduler.yieldTask(function resumeUpdateConcurrentFromRoot() {
        if (hasSync || checkNextFiberIsSync(renderDispatch)) {
          updateSyncFromRoot(renderDispatch);
        } else {
          updateConcurrentNextFrame(renderDispatch);
        }
      });
    }
  } else {
    processAsyncLoadListOnUpdate(renderDispatch);

    finishUpdateConcurrentFromRoot(renderDispatch);

    renderScheduler.microTask(function callScheduleNext() {
      globalLoop.current = false;

      scheduleNext(renderDispatch);
    });
  }
};
