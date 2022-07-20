import {
  globalDispatch,
  safeCallWithFiber,
  pendingCreateFiberArray,
} from '../share';

import type { MyReactFiberNode } from '../fiber';

export const pushCreate = (fiber: MyReactFiberNode) => {
  if (!fiber.__isTextNode__ && !fiber.__isPlainNode__ && !fiber.__isPortal__)
    return;
  if (!fiber.__pendingCreate__) {
    fiber.__pendingCreate__ = true;
    pendingCreateFiberArray.current.push(fiber);
  }
};

export const runCreate = () => {
  const allPendingCreate = pendingCreateFiberArray.current.slice(0);
  allPendingCreate.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingCreate__) {
      safeCallWithFiber({
        action: () => globalDispatch.current.create(fiber),
        fiber,
      });
      fiber.__pendingCreate__ = false;
    }
  });
  pendingCreateFiberArray.current = [];
};
