import { __my_react_internal__ } from "@my-react/react";
import { updateLoopAsync, updateLoopSync } from "@my-react/react-reconciler";


import { shouldPauseAsyncUpdate } from "@my-react-dom-shared";

import type { ReconcilerLoopController } from "@my-react/react-reconciler";

const { globalLoop } = __my_react_internal__;

export const updateAllSync = (updateFiberController: ReconcilerLoopController, reconcileUpdate: () => void) => {
  globalLoop.current = true;

  updateLoopSync(updateFiberController, reconcileUpdate);

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) updateAllSync(updateFiberController, reconcileUpdate);
  });
};

export const updateAllAsync = (updateFiberController: ReconcilerLoopController, reconcileUpdate: () => void) => {
  globalLoop.current = true;

  updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate, reconcileUpdate);

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) updateAllAsync(updateFiberController, reconcileUpdate);
  });
};
