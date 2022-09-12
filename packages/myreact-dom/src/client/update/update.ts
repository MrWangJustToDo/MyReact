import { __my_react_internal__ } from "@my-react/react";
import { updateLoopAsync, updateLoopSync } from "@my-react/react-reconciler";

import { reconcileUpdate, shouldPauseAsyncUpdate } from "@ReactDOM_shared";

import { generateUpdateControllerWithDispatch } from "./tool";

import type { FiberDispatch, RenderScope } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

export const updateAllSync = (globalDispatch: FiberDispatch, globalScope: RenderScope) => {
  globalLoop.current = true;

  const updateFiberController = generateUpdateControllerWithDispatch(globalDispatch, globalScope);

  updateLoopSync(updateFiberController, () => reconcileUpdate(globalDispatch, globalScope));

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) updateAllSync(globalDispatch, globalScope);
  });
};

export const updateAllAsync = (globalDispatch: FiberDispatch, globalScope: RenderScope) => {
  globalLoop.current = true;

  const updateFiberController = generateUpdateControllerWithDispatch(globalDispatch, globalScope);

  updateLoopAsync(updateFiberController, shouldPauseAsyncUpdate, () => reconcileUpdate(globalDispatch, globalScope));

  globalLoop.current = false;

  Promise.resolve().then(() => {
    if (updateFiberController.hasNext()) updateAllAsync(globalDispatch, globalScope);
  });
};
