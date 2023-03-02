import type { FiberDispatch, RenderScope } from "@my-react/react";

export const generateReconcileUpdate = (globalDispatch: FiberDispatch, globalScope: RenderScope) => () => {
  const allPendingList = globalScope.updateFiberListArray.slice(0);

  requestAnimationFrame(() => allPendingList.forEach((l) => globalDispatch.reconcileUpdate(l)));

  globalScope.updateFiberListArray = [];
};
