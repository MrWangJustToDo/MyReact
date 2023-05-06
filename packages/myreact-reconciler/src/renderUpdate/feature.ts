import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { updateLoopConcurrentWithSkip, updateLoopConcurrentWithTrigger, updateLoopSyncWithSkip, updateLoopSyncWithTrigger } from "../runtimeUpdate";
import { resetLogScope, safeCall, setLogScope } from "../share";

import type { MyReactContainer } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const updateSyncWithSkip = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderDispatch = container.renderDispatch;

  const renderPlatform = container.renderPlatform;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopSyncWithSkip(renderContainer));

  enableScopeTreeLog.current && resetLogScope();

  const commitList = renderContainer.pendingCommitFiberList;

  renderContainer.pendingCommitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  renderPlatform.microTask(() => {
    globalLoop.current = false;

    cb?.();
  });
};

export const updateSyncWithTrigger = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderDispatch = container.renderDispatch;

  const renderPlatform = container.renderPlatform;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopSyncWithTrigger(renderContainer));

  enableScopeTreeLog.current && resetLogScope();

  const commitList = renderContainer.pendingCommitFiberList;

  renderContainer.pendingCommitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  renderPlatform.microTask(() => {
    globalLoop.current = false;

    cb?.();
  });
};

export const updateConcurrentWithSkip = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderPlatform = container.renderPlatform;

  const renderDispatch = container.renderDispatch;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopConcurrentWithSkip(renderContainer));

  enableScopeTreeLog.current && resetLogScope();

  if (renderContainer.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentWithSkip(container, cb));
  } else {
    const commitList = renderContainer.pendingCommitFiberList;

    renderContainer.pendingCommitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};

export const updateConcurrentWithTrigger = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderPlatform = container.renderPlatform;

  const renderDispatch = container.renderDispatch;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => updateLoopConcurrentWithTrigger(renderContainer));

  enableScopeTreeLog.current && resetLogScope();

  if (renderContainer.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentWithTrigger(container, cb));
  } else {
    const commitList = renderContainer.pendingCommitFiberList;

    renderContainer.pendingCommitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};
