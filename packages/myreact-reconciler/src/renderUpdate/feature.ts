import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { updateLoopConcurrentWithAll, updateLoopConcurrentWithTrigger, updateLoopSyncWithAll, updateLoopSyncWithTrigger } from "../runtimeUpdate";
import { resetLogScope, safeCall, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const updateSyncWithAll = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopSyncWithAll(renderDispatch));

  enableScopeTreeLog.current && resetLogScope();

  const commitList = renderDispatch.pendingCommitFiberList;

  renderDispatch.pendingCommitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  renderPlatform.microTask(() => {
    globalLoop.current = false;

    cb?.();
  });
};

export const updateSyncWithTrigger = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopSyncWithTrigger(renderDispatch));

  enableScopeTreeLog.current && resetLogScope();

  const commitList = renderDispatch.pendingCommitFiberList;

  renderDispatch.pendingCommitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  renderPlatform.microTask(() => {
    globalLoop.current = false;

    cb?.();
  });
};

export const updateConcurrentWithAll = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopConcurrentWithAll(renderDispatch));

  enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentWithAll(renderDispatch, cb));
  } else {
    const commitList = renderDispatch.pendingCommitFiberList;

    renderDispatch.pendingCommitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};

export const updateConcurrentWithTrigger = (renderDispatch: CustomRenderDispatch, cb?: () => void) => {
  globalLoop.current = true;

  const renderPlatform = currentRenderPlatform.current;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopConcurrentWithTrigger(renderDispatch));

  enableScopeTreeLog.current && resetLogScope();

  if (renderDispatch.runtimeFiber.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentWithTrigger(renderDispatch, cb));
  } else {
    const commitList = renderDispatch.pendingCommitFiberList;

    renderDispatch.pendingCommitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};
