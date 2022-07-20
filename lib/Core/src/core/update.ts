import {
  globalDispatch,
  pendingUpdateFiberArray,
  safeCallWithFiber,
} from '../share';

import type { MyReactFiberNode } from '../fiber';

export const pushUpdate = (fiber: MyReactFiberNode) => {
  if (!fiber.__isTextNode__ && !fiber.__isPlainNode__) return;
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;
    pendingUpdateFiberArray.current.push(fiber);
  }
};

export const runUpdate = () => {
  const allPendingUpdate = pendingUpdateFiberArray.current.slice(0);
  allPendingUpdate.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingUpdate__) {
      safeCallWithFiber({
        action: () => globalDispatch.current.update(fiber),
        fiber,
      });
      fiber.__pendingUpdate__ = false;
    }
  });
  pendingUpdateFiberArray.current = [];
};
