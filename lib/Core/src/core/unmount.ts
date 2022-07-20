import {
  globalDispatch,
  pendingUnmountFiberArray,
  safeCallWithFiber,
} from '../share';

import type { MyReactFiberNode } from '../fiber';

export const pushUnmount = (fiber: MyReactFiberNode) => {
  if (!fiber.__pendingUnmount__) {
    fiber.__pendingUnmount__ = true;
    pendingUnmountFiberArray.current.push(fiber);
  }
};

export const runUnmount = () => {
  const allPendingUnmount = pendingUnmountFiberArray.current.slice(0);
  allPendingUnmount.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingUnmount__) {
      safeCallWithFiber({
        action: () => globalDispatch.current.unmount(fiber),
        fiber,
      });
      fiber.__pendingUnmount__ = false;
    }
  });
  pendingUnmountFiberArray.current = [];
};
