import { __my_react_internal__ } from "@my-react/react";

import { updateLoop, updateLoopWithConcurrent } from "../runtimeUpdate";
import { safeCall } from "../share";

import type { RenderPlatform } from "../runtimePlatform";
import type { RenderController, RenderScope } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

const { globalLoop } = __my_react_internal__;

const reconcileUpdate = (renderDispatch: RenderDispatch, renderScope: RenderScope, renderPlatform: RenderPlatform) => {
  const allPendingList = renderScope.pendingCommitFiberListArray.slice(0);

  renderPlatform.macroTask(() => allPendingList.forEach((l) => renderDispatch.reconcileUpdate(l)));

  renderScope.pendingCommitFiberListArray = [];
};

export const updateAll = (renderController: RenderController, renderDispatch: RenderDispatch, renderScope: RenderScope, renderPlatform: RenderPlatform) => {
  globalLoop.current = true;

  safeCall(() => updateLoop(renderController));

  reconcileUpdate(renderDispatch, renderScope, renderPlatform);

  globalLoop.current = false;
};

export const updateAllWithConcurrent = (
  renderController: RenderController,
  renderDispatch: RenderDispatch,
  renderScope: RenderScope,
  renderPlatform: RenderPlatform
) => {
  globalLoop.current = true;

  safeCall(() => updateLoopWithConcurrent(renderController));

  if (!renderController.doesPause()) reconcileUpdate(renderDispatch, renderScope, renderPlatform);

  if (renderController.hasNext()) {
    renderPlatform.microTask(() => updateAllWithConcurrent(renderController, renderDispatch, renderScope, renderPlatform));
  }

  globalLoop.current = false;
};
