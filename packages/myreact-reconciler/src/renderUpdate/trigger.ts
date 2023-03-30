import { __my_react_internal__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { updateConcurrentWithSkip, updateConcurrentWithTrigger, updateSyncWithSkip, updateSyncWithTrigger } from "./feature";

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

    triggerUpdate(errorBoundariesFiber, STATE_TYPE.__triggerSync__);
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

    if (!tempFiber.isMounted || tempFiber.state === STATE_TYPE.__stable__) continue;

    nextWorkFiber = tempFiber;
  }

  if (nextWorkFiber) {
    if (nextWorkFiber.state & (STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
      container.triggeredFiber = nextWorkFiber;
      container.nextWorkingFiber = nextWorkFiber;
      if (nextWorkFiber.state & STATE_TYPE.__triggerSync__) {
        updateSyncWithTrigger(container, () => scheduleUpdate(container));
      } else {
        updateConcurrentWithTrigger(container, () => scheduleUpdate(container));
      }
    } else if (nextWorkFiber.state & (STATE_TYPE.__skippedSync__ | STATE_TYPE.__skippedConcurrent__)) {
      container.triggeredFiber = nextWorkFiber;
      container.nextWorkingFiber = nextWorkFiber;
      if (nextWorkFiber.state & STATE_TYPE.__skippedSync__) {
        updateSyncWithSkip(container, () => scheduleUpdate(container));
      } else {
        updateConcurrentWithSkip(container, () => scheduleUpdate(container));
      }
    } else {
      console.log("un handle", nextWorkFiber);
      // TODO
    }
  } else {
    globalLoop.current = false;

    container.triggeredFiber = null;

    container.commitFiberList = null;

    container.nextWorkingFiber = null;
  }
};

export const triggerUpdate = (fiber: MyReactFiberNode, state: STATE_TYPE) => {
  const renderContainer = fiber.container;

  const renderPlatform = renderContainer.renderPlatform;

  if (renderContainer.isAppCrashed) return;

  if (!renderContainer.isAppMounted) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber, state));

    return;
  }

  fiber.state === STATE_TYPE.__stable__ ? (fiber.state = state) : (fiber.state |= state);

  renderContainer.pendingFiberArray.uniPush(fiber);

  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderContainer);

  // renderPlatform.microTask(() => scheduleUpdate(renderContainer));
};
