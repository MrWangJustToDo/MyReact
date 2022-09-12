import type { FiberDispatch, RenderScope } from "@my-react/react";

export const reconcileUpdate = (globalDispatch: FiberDispatch, globalScope: RenderScope) => {
  const allPendingList = globalScope.updateFiberListArray.slice(0);

  allPendingList.forEach((l) => globalDispatch.reconcileCreate(l));

  allPendingList.forEach((l) => globalDispatch.reconcileUpdate(l));

  globalScope.updateFiberListArray = [];
};
