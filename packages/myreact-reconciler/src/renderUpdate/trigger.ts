import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { updateAll, updateAllWithConcurrent } from "./feature";

import type { RenderDispatch } from "../renderDispatch";
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

    renderController.setTopLevelFiber(errorBoundariesFiber);

    const nextFiber = renderController.performToNextFiberOnError(errorBoundariesFiber, error, fiber);

    renderController.setYieldFiber(nextFiber);

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

  if (__DEV__) {
    renderScope.__globalLoop__ = globalLoop;
  }

  fiber._triggerUpdate();

  const beforeLength = renderScope.pendingProcessFiberArray.length;

  renderScope.pendingProcessFiberArray.uniPush(fiber);

  const afterLength = renderScope.pendingProcessFiberArray.length;

  if (beforeLength === afterLength) return;

  if (globalLoop.current) return;

  renderPlatform.microTask(() => updateEntry(renderController, renderDispatch, renderScope, renderPlatform));
};
