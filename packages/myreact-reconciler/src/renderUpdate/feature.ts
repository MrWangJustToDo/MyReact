import { __my_react_internal__ } from "@my-react/react";

import { updateLoop, updateLoopWithConcurrent } from "../runtimeUpdate";
import { safeCall } from "../share";

import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { RenderController, RenderScope } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const reconcileUpdate = (renderDispatch: RenderDispatch, renderScope: RenderScope, _renderPlatform: RenderPlatform) => {
  const allPendingList = renderScope.pendingCommitFiberListArray.slice(0);

  allPendingList.forEach((l) => renderDispatch.reconcileUpdate(l));

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

  const hasUpdate = !!renderScope.pendingCommitFiberListArray.length;

  if (renderController.hasNext()) {
    if (hasUpdate && renderController.hasUiUpdate) {
      renderPlatform.yieldTask(() => updateAllWithConcurrent(renderController, renderDispatch, renderScope, renderPlatform));
    } else {
      renderPlatform.microTask(() => updateAllWithConcurrent(renderController, renderDispatch, renderScope, renderPlatform));
    }
  } else {
    globalLoop.current = false;
  }

  renderController.hasUiUpdate = false;

  hasUpdate && reconcileUpdate(renderDispatch, renderScope, renderPlatform);
};
