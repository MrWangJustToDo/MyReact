import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { updateWitConcurrent, updateWithSync } from "./feature";

import type { MyReactContainer, MyReactFiberNode } from "../runtimeFiber";
import type { MyReactComponent } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

export const triggerError = (fiber: MyReactFiberNode, error: Error) => {
  const renderContainer = fiber.container;

  const renderDispatch = renderContainer.renderDispatch;

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
    renderContainer.pendingFiberArray.clear();

    renderContainer.triggeredFiber = null;

    renderContainer.nextWorkingFiber = null;

    renderContainer.isAppCrashed = true;
  }
};

export const scheduleUpdate = (container: MyReactContainer) => {
  let nextWorkFiber: MyReactFiberNode | null = null;
  while (!nextWorkFiber && container.pendingFiberArray.length) {
    const tempFiber = container.pendingFiberArray.uniShift();

    if (tempFiber.state & STATE_TYPE.__unmount__ || tempFiber.state & STATE_TYPE.__stable__) continue;

    nextWorkFiber = tempFiber;
  }

  if (nextWorkFiber) {
    if (nextWorkFiber.state === STATE_TYPE.__trigger__) {
      container.triggeredFiber = nextWorkFiber;
      container.nextWorkingFiber = nextWorkFiber;
      updateWithSync(container, () => scheduleUpdate(container));
    } else if (nextWorkFiber.state === STATE_TYPE.__skipped__) {
      container.triggeredFiber = nextWorkFiber;
      container.nextWorkingFiber = nextWorkFiber;
      updateWitConcurrent(container, () => scheduleUpdate(container));
    } else {
      // TODO
    }
  } else {
    container.triggeredFiber = null;
    container.commitFiberList = null;
    container.nextWorkingFiber = null;
  }
};

export const triggerUpdate = (fiber: MyReactFiberNode) => {
  const renderContainer = fiber.container;

  const renderPlatform = renderContainer.renderPlatform;

  if (renderContainer.isAppCrashed) return;

  if (!renderContainer.isAppMounted) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber));

    return;
  }

  if (__DEV__) {
    (renderContainer as any).__globalLoop__ = globalLoop;
  }

  fiber.state = STATE_TYPE.__trigger__;

  renderContainer.pendingFiberArray.uniPush(fiber);

  if (globalLoop.current) return;

  globalLoop.current = true;

  renderPlatform.microTask(() => scheduleUpdate(renderContainer));
};

export const triggerRoot = (fiber: MyReactFiberNode) => {
  const renderContainer = fiber.container;

  const renderPlatform = renderContainer.renderPlatform;

  if (renderContainer.isAppCrashed) return;

  if (!renderContainer.isAppMounted) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber));

    return;
  }

  if (__DEV__) {
    (renderContainer as any).__globalLoop__ = globalLoop;
  }

  fiber.state = STATE_TYPE.__skipped__;

  renderContainer.pendingFiberArray.uniPush(fiber);

  if (globalLoop.current) return;

  globalLoop.current = true;

  renderPlatform.microTask(() => scheduleUpdate(renderContainer));
};
