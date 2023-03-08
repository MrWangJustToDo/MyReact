import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { performToNextFiberOnError } from "../dispatchNextWork";
import { updateAll, updateAllWithConcurrent } from "../dispatchUpdate";

import type { RenderDispatch } from "../runtimeDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode, RenderController, RenderScope } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableConcurrentMode } = __my_react_shared__;

const updateEntry = (renderController: RenderController, renderDispatch: RenderDispatch, renderScope: RenderScope, renderPlatform: RenderPlatform) => {
  if (enableConcurrentMode.current) {
    updateAllWithConcurrent(renderController, renderDispatch, renderScope, renderPlatform);
  } else {
    updateAll(renderController, renderDispatch, renderScope, renderPlatform);
  }
};

export const triggerError = (fiber: MyReactFiberNode, error: Error) => {
  const renderScope = fiber.root.renderScope;

  const renderController = fiber.root.renderController;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    errorBoundariesFiber._triggerUpdate();

    // clear current scope
    renderController.reset();

    renderController.setTopLevel(errorBoundariesFiber);

    const nextFiber = performToNextFiberOnError(errorBoundariesFiber, error, fiber);

    renderController.setYield(nextFiber);

    updateAllWithConcurrent(renderController, renderDispatch, renderScope, renderPlatform);
  } else {
    renderController.reset();

    renderScope.isAppCrashed = true;
  }
};

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  const renderScope = fiber.root.renderScope;

  const renderController = fiber.root.renderController;

  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const renderPlatform = fiber.root.renderPlatform as RenderPlatform;

  if (renderScope.isAppCrashed) return;

  if (renderScope.isPending) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber));

    return;
  }

  renderScope.pendingProcessFiberArray.uniPush(fiber);

  if (globalLoop.current) return;

  updateEntry(renderController, renderDispatch, renderScope, renderPlatform);
};
