import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { generateReconcileUpdate } from "@ReactDOM_shared";

import { generateUpdateControllerWithDispatch } from "./tool";
import { updateAllAsync, updateAllSync } from "./update";

import type { MyReactFiberNode, FiberDispatch, RenderScope } from "@my-react/react";
import type { DomScope } from "@ReactDOM_shared";

const { globalLoop } = __my_react_internal__;

const { enableAsyncUpdate } = __my_react_shared__;

const updateEntry = (globalDispatch: FiberDispatch, globalScope: RenderScope) => {
  if (globalLoop.current) return;
  const updateFiberController = generateUpdateControllerWithDispatch(globalDispatch, globalScope);
  const reconcileUpdate = generateReconcileUpdate(globalDispatch, globalScope);
  if (enableAsyncUpdate.current) {
    updateAllAsync(updateFiberController, reconcileUpdate);
  } else {
    updateAllSync(updateFiberController, reconcileUpdate);
  }
};

const asyncUpdate = (globalDispatch: FiberDispatch, globalScope: RenderScope) =>
  Promise.resolve().then(() => updateEntry(globalDispatch, globalScope));

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  const globalScope = fiber.root.scope as DomScope;

  const globalDispatch = fiber.root.dispatch;

  if (globalScope.isHydrateRender || globalScope.isServerRender) {
    if (__DEV__) {
      console.log("can not update component");
    }
    return;
  }

  fiber.triggerUpdate();

  globalScope.modifyFiberArray.push(fiber);

  asyncUpdate(globalDispatch, globalScope);
};
