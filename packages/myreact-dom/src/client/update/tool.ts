import type { MyReactFiberNode, FiberDispatch, RenderScope } from "@my-react/react";

let currentYield: MyReactFiberNode | null = null;

export const generateUpdateControllerWithDispatch = (globalDispatch: FiberDispatch, globalScope: RenderScope) => ({
  setYield: (fiber: MyReactFiberNode | null) => {
    if (fiber) {
      currentYield = fiber;
    } else {
      currentYield = null;

      globalDispatch.endProgressList(globalScope);
    }
  },

  getNext: () => {
    if (globalScope.isAppCrash) return null;

    const yieldFiber = currentYield;

    currentYield = null;

    if (yieldFiber) return yieldFiber;

    while (globalScope.modifyFiberArray.length) {
      const newProgressFiber = globalScope.modifyFiberArray.shift();

      if (newProgressFiber?.mount) {
        globalDispatch.beginProgressList(globalScope);

        globalScope.modifyFiberRoot = newProgressFiber;

        return newProgressFiber;
      }
    }

    return null;
  },

  getUpdateList: (fiber: MyReactFiberNode) => {
    globalDispatch.generateUpdateList(fiber, globalScope);
  },

  hasNext: () => {
    if (globalScope.isAppCrash) return false;

    return currentYield !== null || globalScope.modifyFiberArray.length > 0;
  },

  doesPause: () => currentYield !== null,

  getTopLevel: () => globalScope.modifyFiberRoot,
});
