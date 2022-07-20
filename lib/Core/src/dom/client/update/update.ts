import {
  renderLoopAsync,
  renderLoopSync,
  runAppend,
  runCreate,
  runPosition,
  runUnmount,
  runUpdate,
} from '../../../core';
import { runEffect, runLayoutEffect } from '../../../effect';
import {
  globalLoop,
  pendingSyncModifyFiberArray,
  safeCall,
  shouldYieldAsyncUpdate,
} from '../../../share';

import {
  getPendingSyncModifyFiberArray,
  pendingAsyncModifyFiberControl,
} from './tool';

export const updateAllSync = () => {
  globalLoop.current = true;

  const allPendingUpdate = getPendingSyncModifyFiberArray();

  if (allPendingUpdate.length) {
    safeCall(() => allPendingUpdate.forEach(renderLoopSync));

    runCreate();

    runUpdate();

    runPosition();

    runAppend();

    runUnmount();

    runLayoutEffect();

    runEffect();
  }

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
    shouldYieldAsyncUpdate,
    () => {
      if (!pendingAsyncModifyFiberControl.yield()) {
        runCreate();

        runUpdate();

        runPosition();

        runAppend();

        runUnmount();

        runLayoutEffect();

        runEffect();
      }
    },
    () => {
      globalLoop.current = false;
    }
  );

  Promise.resolve().then(() => {
    if (pendingAsyncModifyFiberControl.has()) {
      updateAllAsync();
    }
  });
};
