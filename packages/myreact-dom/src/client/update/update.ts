import { __myreact_internal__ } from "@my-react/react";
import { updateLoopAsync, updateLoopSync } from "@my-react/react-reconciler";

import { reconcileUpdate, shouldPauseAsyncUpdate } from "@ReactDOM_shared";

import { updateFiberController } from "./tool";

const { globalLoop } = __myreact_internal__;

export const updateAllSync = () => {
  globalLoop.current = true;

  updateLoopSync(updateFiberController, reconcileUpdate);

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) {
      updateAllSync();
    }
  });
};

export const updateAllAsync = () => {
  globalLoop.current = true;

  updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate, reconcileUpdate);

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) {
      updateAllAsync();
    }
  });
};
