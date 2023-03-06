import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { performToNextFiberOnError } from "@my-react/react-reconciler";

import { asyncUpdateTimeStep } from "@my-react-dom-shared";

import { updateAll, updateAllWithConcurrent } from "./update";

import type { MyReactFiberNode, RenderScope, RenderController } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";

const { globalLoop } = __my_react_internal__;

const { enableConcurrentMode } = __my_react_shared__;

const updateEntry = (renderController: RenderController, renderDispatch: RenderDispatch, renderScope: RenderScope) => {
  if (globalLoop.current) return;

  asyncUpdateTimeStep.current = Date.now();

  if (enableConcurrentMode.current) {
    updateAllWithConcurrent(renderController, renderDispatch, renderScope);
  } else {
    updateAll(renderController, renderDispatch, renderScope);
  }
};

const asyncUpdate = (renderController: RenderController, renderDispatch: RenderDispatch, renderScope: RenderScope) =>
  Promise.resolve().then(() => updateEntry(renderController, renderDispatch, renderScope));

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  const renderScope = fiber.root.renderScope;

  const renderController = fiber.root.renderController;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  if (renderScope.isHydrateRender || renderScope.isServerRender) {
    if (__DEV__) console.log("can not update component");
    setTimeout(() => triggerUpdate(fiber));
    return;
  }

  renderScope.pendingProcessFiberArray.push(fiber);

  asyncUpdate(renderController, renderDispatch, renderScope);
};

export const triggerError = (fiber: MyReactFiberNode, error: Error) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    errorBoundariesFiber.triggerUpdate();

    // clear current scope
    const renderDispatch = errorBoundariesFiber.root.renderDispatch as RenderDispatch;

    const renderController = errorBoundariesFiber.root.renderController;

    const renderScope = errorBoundariesFiber.root.renderScope;

    renderController.reset();

    renderController.setTopLevel(errorBoundariesFiber);

    const nextFiber = performToNextFiberOnError(errorBoundariesFiber, error, fiber);

    renderController.setYield(nextFiber);

    updateAllWithConcurrent(renderController, renderDispatch, renderScope);
  }
};
