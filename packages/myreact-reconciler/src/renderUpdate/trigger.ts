import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { updateConcurrentWithSkip, updateConcurrentWithTrigger, updateSyncWithSkip, updateSyncWithTrigger } from "./feature";

import type { MyReactContainer, MyReactFiberNode } from "../runtimeFiber";
import type { MyReactComponent } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableConcurrentMode } = __my_react_shared__;

export const triggerError = (fiber: MyReactFiberNode, error: Error) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  const renderPlatform = renderContainer.renderPlatform;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    const typedInstance = errorBoundariesFiber.instance as MyReactComponent;

    typedInstance._error = {
      error: error,
      stack: renderPlatform.getFiberTree(fiber),
      hasError: true,
      _restoreState: Object.assign({}, typedInstance._error._restoreState || {}),
    };

    triggerUpdate(errorBoundariesFiber, STATE_TYPE.__triggerSync__);
  } else {
    renderContainer.pendingUpdateFiberArray.clear();

    renderContainer.scheduledFiber = null;

    renderContainer.nextWorkingFiber = null;

    renderContainer.isAppCrashed = true;
  }
};

export const scheduleUpdate = (container: MyReactContainer) => {
  let nextWorkFiber: MyReactFiberNode | null = null;

  while (!nextWorkFiber && container.pendingUpdateFiberArray.length) {
    const tempFiber = container.pendingUpdateFiberArray.uniShift();

    if (tempFiber.state & (STATE_TYPE.__stable__ | STATE_TYPE.__unmount__)) continue;

    nextWorkFiber = tempFiber;
  }

  if (nextWorkFiber) {
    if (nextWorkFiber.state & (STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
      container.scheduledFiber = nextWorkFiber;

      container.nextWorkingFiber = nextWorkFiber;

      if (nextWorkFiber.state & STATE_TYPE.__triggerSync__) {
        updateSyncWithTrigger(container, () => scheduleUpdate(container));
      } else if (enableConcurrentMode.current) {
        updateConcurrentWithTrigger(container, () => scheduleUpdate(container));
      } else {
        updateSyncWithTrigger(container, () => scheduleUpdate(container));
      }
    } else if (nextWorkFiber.state & (STATE_TYPE.__skippedSync__ | STATE_TYPE.__skippedConcurrent__)) {
      container.scheduledFiber = nextWorkFiber;

      container.nextWorkingFiber = nextWorkFiber;

      if (nextWorkFiber.state & STATE_TYPE.__skippedSync__) {
        updateSyncWithSkip(container, () => scheduleUpdate(container));
      } else if (enableConcurrentMode.current) {
        updateConcurrentWithSkip(container, () => scheduleUpdate(container));
      } else {
        updateSyncWithSkip(container, () => scheduleUpdate(container));
      }
    } else {
      // TODO
      throw new Error(`un handler state, ${nextWorkFiber.state}`);
    }
  } else {
    globalLoop.current = false;

    container.scheduledFiber = null;

    container.nextWorkingFiber = null;

    container.pendingCommitFiberList = null;
  }
};

export const triggerUpdate = (fiber: MyReactFiberNode, state: STATE_TYPE) => {
  const renderContainer = fiber.renderContainer;

  const renderPlatform = renderContainer.renderPlatform;

  if (renderContainer.isAppCrashed) return;

  if (!renderContainer.isAppMounted) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber, state));

    return;
  }

  fiber.state === STATE_TYPE.__stable__ ? (fiber.state = state) : (fiber.state |= state);

  renderContainer.pendingUpdateFiberArray.uniPush(fiber);

  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderContainer);
};
