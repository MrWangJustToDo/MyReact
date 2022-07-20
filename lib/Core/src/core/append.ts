import {
  globalDispatch,
  pendingAppendFiberArray,
  safeCallWithFiber,
} from '../share';

import type { MyReactFiberNode } from '../fiber';

export const pushAppend = (fiber: MyReactFiberNode) => {
  if (!fiber.__isTextNode__ && !fiber.__isPlainNode__) return;
  if (!fiber.__pendingAppend__) {
    fiber.__pendingAppend__ = true;
    pendingAppendFiberArray.current.push(fiber);
  }
};

export const runAppend = () => {
  const allPendingAppend = pendingAppendFiberArray.current.slice(0);
  allPendingAppend.forEach((fiber) => {
    if (fiber.mount && fiber.__pendingAppend__) {
      safeCallWithFiber({
        action: () => globalDispatch.current.append(fiber),
        fiber,
      });
      fiber.__pendingAppend__ = false;
    }
  });
  pendingAppendFiberArray.current = [];
};
