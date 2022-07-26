import { updateLoopAsync, updateLoopSync } from '../../../core';
import { globalLoop, shouldPauseAsyncUpdate } from '../../../share';
import { reconcileUpdate } from '../../shared';

import { updateFiberController } from './tool';

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

  updateLoopAsync(
    updateFiberController,
    shouldPauseAsyncUpdate,
    reconcileUpdate
  );

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) {
      updateAllAsync();
    }
  });
};
