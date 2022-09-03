import { __myreact_internal__ } from "@my-react/react";

import { pendingModifyFiberArray, pendingModifyTopLevelFiber } from "@ReactDOM_shared";

import type { MyReactFiberNode } from "@my-react/react";

const { globalDispatch, isAppCrash } = __myreact_internal__;

let currentYield: MyReactFiberNode | null = null;

export const updateFiberController = {
  setYield: (fiber: MyReactFiberNode | null) => {
    if (fiber) {
      currentYield = fiber;
    } else {
      currentYield = null;
      globalDispatch.current.endProgressList();
    }
  },
  getNext: () => {
    if (isAppCrash.current) return null;
    const yieldFiber = currentYield;
    currentYield = null;
    if (yieldFiber) return yieldFiber;
    while (pendingModifyFiberArray.current.length) {
      const newProgressFiber = pendingModifyFiberArray.current.shift();
      if (newProgressFiber?.mount) {
        globalDispatch.current.beginProgressList();
        pendingModifyTopLevelFiber.current = newProgressFiber;
        return newProgressFiber;
      }
    }
    return null;
  },
  getUpdateList: (fiber: MyReactFiberNode) => {
    globalDispatch.current.generateUpdateList(fiber);
  },
  hasNext: () => {
    if (isAppCrash.current) return false;
    return currentYield !== null || pendingModifyFiberArray.current.length > 0;
  },
  doesPause: () => currentYield !== null,
  getTopLevel: () => pendingModifyTopLevelFiber.current,
};
