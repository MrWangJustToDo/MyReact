import {
  pendingAsyncModifyFiberArray,
  pendingSyncModifyFiberArray,
  pendingUpdateFiberArray,
} from "../env.js";
import { shouldYieldAsyncUpdate } from "../tool.js";
import { MyReactFiberNode } from "../fiber/index.js";
import { commitUpdate } from "./loop.js";
import { safeCallWithFiber } from "../debug.js";

const getPendingModifyFiberArray = () => {
  const pendingUpdate = pendingSyncModifyFiberArray.current
    .slice(0)
    .filter((f) => f.__needUpdate__ && f.mount);

  pendingUpdate.sort((f1, f2) => (f1.deepIndex - f2.deepIndex > 0 ? 1 : -1));

  pendingSyncModifyFiberArray.current = [];

  return pendingUpdate;
};

const getPendingModifyFiberNext = () => {
  if (shouldYieldAsyncUpdate()) return null;
  while (pendingAsyncModifyFiberArray.current.length) {
    const nextFiber = pendingAsyncModifyFiberArray.current.popTop();
    if (nextFiber.mount && nextFiber.__needUpdate__) {
      return nextFiber;
    }
  }
  return null;
};

/**
 *
 * @param {MyReactFiberNode} fiber
 */
const pushUpdate = (fiber) => {
  if (!fiber.__pendingUpdate__) {
    fiber.__pendingUpdate__ = true;
    pendingUpdateFiberArray.current.push(fiber);
  }
};

const runUpdate = () => {
  const allUpdateFiberArray = pendingUpdateFiberArray.current.slice(0);
  allUpdateFiberArray.forEach((f) => {
    if (f.mount && f.__pendingUpdate__) {
      safeCallWithFiber({ action: () => commitUpdate(f), fiber: f });
    } else {
      console.error("update error");
    }
  });
  pendingUpdateFiberArray.current = [];
};

export {
  getPendingModifyFiberArray,
  getPendingModifyFiberNext,
  pushUpdate,
  runUpdate,
};
