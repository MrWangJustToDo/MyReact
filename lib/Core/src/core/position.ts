import {
  globalDispatch,
  pendingPositionFiberArray,
  safeCallWithFiber,
} from '../share';

import type { MyReactFiberNode } from '../fiber';

export const pushPosition = (fiber: MyReactFiberNode) => {
  if (!fiber.__pendingPosition__) {
    fiber.__pendingPosition__ = true;
    pendingPositionFiberArray.current.push(fiber);
  }
};

export const runPosition = () => {
  const allPendingPosition = pendingPositionFiberArray.current.slice(0);
  allPendingPosition.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingPosition__) {
      safeCallWithFiber({
        action: () => globalDispatch.current.position(fiber),
        fiber,
      });
      fiber.__pendingPosition__ = false;
    }
  });
  pendingPositionFiberArray.current = [];
};
