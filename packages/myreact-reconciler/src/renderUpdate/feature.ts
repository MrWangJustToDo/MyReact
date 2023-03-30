import { __my_react_internal__ } from "@my-react/react";

import { updateLoopConcurrentWithSkip, updateLoopConcurrentWithTrigger, updateLoopSyncWithSkip, updateLoopSyncWithTrigger } from "../runtimeUpdate";
import { safeCall } from "../share";

import type { MyReactContainer } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

export const updateSyncWithSkip = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderDispatch = container.renderDispatch;

  const renderPlatform = container.renderPlatform;

  safeCall(() => updateLoopSyncWithSkip(renderContainer));

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

  safeCall(() => updateLoopSyncWithTrigger(renderContainer));

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

  safeCall(() => updateLoopConcurrentWithSkip(renderContainer));

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

  safeCall(() => updateLoopConcurrentWithTrigger(renderContainer));

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
