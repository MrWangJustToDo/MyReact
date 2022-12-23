import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { nextWorkError } from "@my-react/react-reconciler";

import { ClientDispatch } from "@my-react-dom-client";
import { generateReconcileUpdate, DomScope } from "@my-react-dom-shared";

import { generateUpdateControllerWithDispatch } from "./tool";
import { updateAllAsync, updateAllSync } from "./update";

import type { MyReactFiberNode, FiberDispatch } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableConcurrentMode } = __my_react_shared__;

const updateEntry = (globalDispatch: FiberDispatch, globalScope: DomScope) => {
  if (globalLoop.current) return;

  const updateFiberController = generateUpdateControllerWithDispatch(globalDispatch, globalScope);

  const reconcileUpdate = generateReconcileUpdate(globalDispatch, globalScope);

  if (enableConcurrentMode.current) {
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
    if (__DEV__) console.log("can not update component");
    setTimeout(() => triggerUpdate(fiber));
    return;
  }

  fiber.triggerUpdate();

  globalScope.modifyFiberArray.push(fiber);

  if (enableConcurrentMode.current) {
    asyncUpdate(globalDispatch, globalScope);
  } else {
    updateEntry(globalDispatch, globalScope);
  }
};

export const triggerError = (fiber: MyReactFiberNode, error: Error) => {
  const globalDispatch = fiber.root.globalDispatch;

  const errorBoundariesFiber = globalDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    const errorDispatch = new ClientDispatch();

    const errorScope = new DomScope();

    errorScope.modifyFiberRoot = errorBoundariesFiber;

    errorBoundariesFiber.triggerUpdate();

    const updateFiberController = generateUpdateControllerWithDispatch(errorDispatch, errorScope);

    const reconcileUpdate = generateReconcileUpdate(errorDispatch, errorScope);

    const nextFiber = nextWorkError(errorBoundariesFiber, updateFiberController, error, fiber);

    updateFiberController.setYield(nextFiber);

    updateAllSync(updateFiberController, reconcileUpdate);
  }
};
