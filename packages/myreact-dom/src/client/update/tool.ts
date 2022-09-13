import type { MyReactFiberNode, FiberDispatch, RenderScope } from "@my-react/react";
import type { ReconcilerLoopController } from "@my-react/react-reconciler";

type ReconcilerLoopControllerWithCache = ReconcilerLoopController & { currentYield: MyReactFiberNode | null };

export const generateUpdateControllerWithDispatch = (globalDispatch: FiberDispatch, globalScope: RenderScope) => {
  // const runningCache: Record<string, boolean> = {};

  const controller: ReconcilerLoopControllerWithCache = {
    currentYield: null,

    setYield: (fiber: MyReactFiberNode | null) => {
      if (fiber) {
        controller.currentYield = fiber;
      } else {
        controller.currentYield = null;

        globalDispatch.endProgressList(globalScope);
      }
    },

    getNext: () => {
      if (globalScope.isAppCrash) return null;

      const yieldFiber = controller.currentYield;

      controller.currentYield = null;

      if (yieldFiber) return yieldFiber;

      globalScope.modifyFiberRoot = null;

      while (globalScope.modifyFiberArray.length) {
        const newProgressFiber = globalScope.modifyFiberArray.shift();

        if (newProgressFiber?.mount /* && !runningCache[newProgressFiber.uid] */) {
          // runningCache[newProgressFiber.uid] = true;

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

      return controller.currentYield !== null || globalScope.modifyFiberArray.length > 0;
    },

    doesPause: () => controller.currentYield !== null,

    getTopLevel: () => globalScope.modifyFiberRoot,
  };

  return controller;
};
