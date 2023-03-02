import { __my_react_internal__ } from "@my-react/react";
import { updateLoopAsync, updateLoopSync } from "@my-react/react-reconciler";

import { resetScopeLog, safeCall, setScopeLog, shouldPauseAsyncUpdate } from "@my-react-dom-shared";

import type { ReconcilerLoopController } from "@my-react/react-reconciler";

const { globalLoop } = __my_react_internal__;

export const updateAllSync = (updateFiberController: ReconcilerLoopController, reconcileUpdate: () => void) => {
  globalLoop.current = true;

  if (__DEV__) {
    setScopeLog();
  }

  safeCall(() => updateLoopSync(updateFiberController));

  reconcileUpdate();

  if (__DEV__) {
    resetScopeLog();
  }

  globalLoop.current = false;

  // Promise.resolve().then(() => {
  // if (updateFiberController.hasNext()) updateAllSync(updateFiberController, reconcileUpdate);
  // });
};

export const updateAllAsync = (updateFiberController: ReconcilerLoopController, reconcileUpdate: () => void) => {
  globalLoop.current = true;

  if (__DEV__) {
    setScopeLog();
  }

  safeCall(() => updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate));

  const doesPause = updateFiberController.doesPause();

  if (!doesPause) reconcileUpdate();

  if (__DEV__) {
    resetScopeLog();
  }

  if (updateFiberController.hasNext()) {
    Promise.resolve().then(() => updateAllAsync(updateFiberController, reconcileUpdate));
  }

  globalLoop.current = false;
};
