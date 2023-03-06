import type { RenderScope } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

export const reconcileUpdate = (renderDispatch: RenderDispatch, renderScope: RenderScope) => {
  const allPendingList = renderScope.pendingCommitFiberListArray.slice(0);

  requestAnimationFrame(() => allPendingList.forEach((l) => renderDispatch.reconcileUpdate(l)));

  renderScope.pendingCommitFiberListArray = [];
};
