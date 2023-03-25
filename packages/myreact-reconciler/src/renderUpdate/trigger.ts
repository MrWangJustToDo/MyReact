import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { updateAll, updateAllWithConcurrent } from "./feature";

import type { RenderDispatch } from "../renderDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { MyReactFiberNode, RenderController, RenderScope, MyReactComponent } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableConcurrentMode, enableSyncFlush } = __my_react_shared__;

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

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    const typedInstance = errorBoundariesFiber.instance as MyReactComponent;

    typedInstance._error = {
      error: error,
      trigger: fiber,
      hasError: true,
    };

    errorBoundariesFiber._update();
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

  if (!renderScope.isAppMounted) {
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

  globalLoop.current = true;

  if (enableSyncFlush.current) {
    updateAll(renderController, renderDispatch, renderScope, renderPlatform);
  } else {
    renderPlatform.microTask(() => updateEntry(renderController, renderDispatch, renderScope, renderPlatform));
  }
};
