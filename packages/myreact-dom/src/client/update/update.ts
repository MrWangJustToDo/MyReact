import { __my_react_internal__ } from "@my-react/react";
import { updateLoop, updateLoopWithConcurrent } from "@my-react/react-reconciler";

import { reconcileUpdate, resetScopeLog, safeCall, setScopeLog } from "@my-react-dom-shared";

import type { RenderController, RenderScope } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

const { globalLoop } = __my_react_internal__;

export const updateAll = (renderController: RenderController, renderDispatch: RenderDispatch, renderScope: RenderScope) => {
  globalLoop.current = true;

  if (__DEV__) {
    setScopeLog();
  }

  safeCall(() => updateLoop(renderController));

  reconcileUpdate(renderDispatch, renderScope);

  if (__DEV__) {
    resetScopeLog();
  }

  globalLoop.current = false;
};

export const updateAllWithConcurrent = (renderController: RenderController, renderDispatch: RenderDispatch, renderScope: RenderScope) => {
  globalLoop.current = true;

  if (__DEV__) {
    setScopeLog();
  }

  safeCall(() => updateLoopWithConcurrent(renderController));

  const doesPause = renderController.doesPause();

  if (!doesPause) reconcileUpdate(renderDispatch, renderScope);

  if (__DEV__) {
    resetScopeLog();
  }

  if (renderController.hasNext()) {
    Promise.resolve().then(() => updateAllWithConcurrent(renderController, renderDispatch, renderScope));
  }

  globalLoop.current = false;
};
