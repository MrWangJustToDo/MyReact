import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { updateLoopConcurrentFromRoot, updateLoopConcurrentFromTrigger, updateLoopSyncFromRoot, updateLoopSyncFromTrigger } from "../runtimeUpdate";
import { resetLogScope, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const updateSyncFromRoot = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopSyncFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  const commitList = renderDispatch.pendingCommitFiberList;

  renderDispatch.resetUpdateFlowRuntimeFiber();

  renderDispatch.pendingCommitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  renderPlatform.microTask(() => {
    globalLoop.current = false;

    cb?.();
  });
};

export const updateSyncFromTrigger = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopSyncFromTrigger(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  const commitList = renderDispatch.pendingCommitFiberList;

  renderDispatch.resetUpdateFlowRuntimeFiber();

  renderDispatch.pendingCommitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  renderPlatform.microTask(() => {
    globalLoop.current = false;

    cb?.();
  });
};

export const updateConcurrentFromRoot = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopConcurrentFromRoot(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentFromRoot(renderDispatch, cb));
  } else {
    const commitList = renderDispatch.pendingCommitFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};

export const updateConcurrentFromTrigger = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  updateLoopConcurrentFromTrigger(renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentFromTrigger(renderDispatch, cb));
  } else {
    const commitList = renderDispatch.pendingCommitFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};
