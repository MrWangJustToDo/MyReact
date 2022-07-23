import { renderLoopAsync, renderLoopSync } from '../../../core';
import {
  globalLoop,
  pendingReconcileFiberArray,
  pendingSyncModifyFiberArray,
  safeCall,
  shouldPauseAsyncUpdate,
} from '../../../share';
import { reconcile } from '../../shared';

import {
  getPendingSyncModifyFiberArray,
  pendingAsyncModifyFiberControl,
} from './tool';

export const updateAllSync = () => {
  globalLoop.current = true;

  const allPendingUpdate = getPendingSyncModifyFiberArray();

  if (allPendingUpdate.length) {
    safeCall(() => allPendingUpdate.forEach(renderLoopSync));
  }

  allPendingUpdate.forEach((fiber) => reconcile(fiber, false));

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (pendingSyncModifyFiberArray.current.length) {
      updateAllSync();
    }
  });
};

export const updateAllAsync = () => {
  globalLoop.current = true;

  renderLoopAsync(
    pendingAsyncModifyFiberControl,
    shouldPauseAsyncUpdate,
    () => {
      const allUpdate = pendingReconcileFiberArray.current;
      allUpdate.forEach((fiber) => reconcile(fiber, false));
      pendingReconcileFiberArray.current = [];
    },
    () => {
      globalLoop.current = false;
    }
  );

  Promise.resolve().then(() => {
    if (pendingAsyncModifyFiberControl.hasNext()) {
      updateAllAsync();
    }
  });
};
