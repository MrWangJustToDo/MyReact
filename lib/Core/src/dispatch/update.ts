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

export const pendingUpdate = (fiber: MyReactFiberNode) => {
  const canUpdate = cannotUpdate();
  if (canUpdate) {
    fiber.__needTrigger__ = true;
    fiber.prepareUpdate();
    if (enableAsyncUpdate.current) {
      pendingAsyncModifyFiberArray.current.push(fiber);
    } else {
      pendingSyncModifyFiberArray.current.push(fiber);
    }
    asyncUpdate();
  }
};
