import { __my_react_internal__ } from "@my-react/react";

import { updateLoopConcurrentWithSkip, updateLoopConcurrentWithTrigger, updateLoopSyncWithSkip, updateLoopSyncWithTrigger } from "../runtimeUpdate";
import { resetLogScope, safeCall, setLogScope } from "../share";

import type { MyReactContainer } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

export const updateSyncWithSkip = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderDispatch = container.renderDispatch;

  const renderPlatform = container.renderPlatform;

  setLogScope();

  safeCall(() => updateLoopSyncWithSkip(renderContainer));

  resetLogScope();

  const commitList = renderContainer.commitFiberList;

  renderContainer.commitFiberList = null;

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

  setLogScope();

  safeCall(() => updateLoopSyncWithTrigger(renderContainer));

  resetLogScope();

  const commitList = renderContainer.commitFiberList;

  renderContainer.commitFiberList = null;

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

  setLogScope();

  safeCall(() => updateLoopConcurrentWithSkip(renderContainer));

  resetLogScope();

  if (renderContainer.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentWithSkip(container, cb));
  } else {
    const commitList = renderContainer.commitFiberList;

    renderContainer.commitFiberList = null;

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

  setLogScope();

  safeCall(() => updateLoopConcurrentWithTrigger(renderContainer));

  resetLogScope();

  if (renderContainer.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateConcurrentWithTrigger(container, cb));
  } else {
    const commitList = renderContainer.commitFiberList;

    renderContainer.commitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    renderPlatform.microTask(() => {
      globalLoop.current = false;

      cb?.();
    });
  }
};
