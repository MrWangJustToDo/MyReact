import {
  cannotUpdate,
  enableAsyncUpdate,
  globalDispatch,
  globalLoop,
  pendingAsyncModifyFiberArray,
  pendingSyncModifyFiberArray,
} from '../share';

import type { MyReactFiberNode } from '../fiber';

const updateEntry = () => {
  if (globalLoop.current) return;
  if (enableAsyncUpdate.current) {
    globalDispatch.current.updateAllAsync();
  } else {
    globalDispatch.current.updateAllSync();
  }
};

const asyncUpdate = () => Promise.resolve().then(updateEntry);

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  const canUpdate = cannotUpdate();
  if (canUpdate) {
    fiber.triggerUpdate();
    if (enableAsyncUpdate.current) {
      pendingAsyncModifyFiberArray.current.push(fiber);
    } else {
      pendingSyncModifyFiberArray.current.push(fiber);
    }
    asyncUpdate();
  }
};
