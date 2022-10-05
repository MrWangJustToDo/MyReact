import type { DomScope } from "@my-react-dom-shared";
import type { FiberDispatch, MyReactFiberNode } from "@my-react/react";
import type { ReconcilerLoopController } from "@my-react/react-reconciler";

type ReconcilerLoopControllerWithCache = ReconcilerLoopController;

export const generateUpdateControllerWithDispatch = (globalDispatch: FiberDispatch, globalScope: DomScope) => {
  const controller: ReconcilerLoopControllerWithCache = {
    setYield: (fiber: MyReactFiberNode | null) => {
      if (fiber) {
        globalScope.currentYield = fiber;
      } else {
        globalScope.currentYield = null;

        globalDispatch.endProgressList(globalScope);
      }
    },

    getNext: () => {
      if (globalScope.isAppCrash) return null;

      const yieldFiber = globalScope.currentYield;

      globalScope.currentYield = null;

      if (yieldFiber) return yieldFiber;

      globalScope.modifyFiberRoot = null;

      while (globalScope.modifyFiberArray.length) {
        const newProgressFiber = globalScope.modifyFiberArray.shift();

        if (newProgressFiber?.mounted) {
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

      return globalScope.currentYield !== null || globalScope.modifyFiberArray.length > 0;
    },

    doesPause: () => globalScope.currentYield !== null,

    getTopLevel: () => globalScope.modifyFiberRoot,
  };

  return controller;
};
