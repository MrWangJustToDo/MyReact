import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { generateReconcileUpdate } from "@my-react-dom-shared";

import { generateUpdateControllerWithDispatch } from "./tool";
import { updateAllAsync, updateAllSync } from "./update";

import type { DomScope } from "@my-react-dom-shared";
import type { MyReactFiberNode, FiberDispatch } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableAsyncUpdate } = __my_react_shared__;

const updateEntry = (globalDispatch: FiberDispatch, globalScope: DomScope) => {
  if (globalLoop.current) return;
  const updateFiberController = generateUpdateControllerWithDispatch(globalDispatch, globalScope);
  const reconcileUpdate = generateReconcileUpdate(globalDispatch, globalScope);
  if (enableAsyncUpdate.current) {
    updateAllAsync(updateFiberController, reconcileUpdate);
  } else {
    updateAllSync(updateFiberController, reconcileUpdate);
  }
};

const asyncUpdate = (globalDispatch: FiberDispatch, globalScope: DomScope) => Promise.resolve().then(() => updateEntry(globalDispatch, globalScope));

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  const globalScope = fiber.root.globalScope as DomScope;

  const globalDispatch = fiber.root.globalDispatch;

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
