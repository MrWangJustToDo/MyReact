import { __my_react_internal__ } from "@my-react/react";

import { updateLoop, updateLoopWithConcurrent } from "../runtimeUpdate";
import { safeCall } from "../share";

import type { MyReactContainer } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

export const updateWithSync = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderDispatch = container.renderDispatch;

  const renderPlatform = container.renderPlatform;

  safeCall(() => updateLoop(renderContainer));

  const commitList = renderContainer.commitFiberList;

  renderContainer.commitFiberList = null;

  commitList && renderDispatch.reconcileUpdate(commitList);

  if (commitList) {
    renderPlatform.yieldTask(() => {
      globalLoop.current = false;
      cb?.();
    });
  } else {
    renderPlatform.microTask(() => {
      globalLoop.current = false;
      cb?.();
    });
  }
};

export const updateWitConcurrent = (container: MyReactContainer, cb?: () => void) => {
  globalLoop.current = true;

  const renderContainer = container;

  const renderPlatform = container.renderPlatform;

  const renderDispatch = container.renderDispatch;

  safeCall(() => updateLoopWithConcurrent(renderContainer));

  if (renderContainer.nextWorkingFiber) {
    renderPlatform.yieldTask(() => updateWitConcurrent(container, cb));
  } else {
    const commitList = renderContainer.commitFiberList;

    renderContainer.commitFiberList = null;

    commitList && renderDispatch.reconcileUpdate(commitList);

    // if (commitList) {
    //   renderPlatform.yieldTask(() => {
    //     globalLoop.current = false;
    //     cb?.();
    //   });
    // } else {
    renderPlatform.yieldTask(() => {
      globalLoop.current = false;
      cb?.();
    });
    // }
  }
};
