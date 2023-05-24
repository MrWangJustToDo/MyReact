import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { fiberToDispatchMap } from "../share";

import { updateConcurrentWithSkip, updateConcurrentWithTrigger, updateSyncWithSkip, updateSyncWithTrigger } from "./feature";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactComponent } from "@my-react/react";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableConcurrentMode, enableLoopFromRoot } = __my_react_shared__;

export const triggerError = (fiber: MyReactFiberNode, error: Error) => {
  const renderDispatch = fiberToDispatchMap.get(fiber);

  const renderPlatform = currentRenderPlatform.current;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    const typedInstance = errorBoundariesFiber.instance as MyReactComponent;

    // prepare error catch flow
    errorBoundariesFiber.pendingState.error = {
      error,
      stack: renderPlatform.getFiberTree(fiber),
      revertState: Object.assign({}, typedInstance.state),
    };

    triggerUpdate(errorBoundariesFiber, STATE_TYPE.__triggerSync__);
  } else {
    renderDispatch.pendingUpdateFiberArray.clear();

    renderDispatch.runtimeFiber.scheduledFiber = null;

    renderDispatch.runtimeFiber.nextWorkingFiber = null;

    renderDispatch.isAppCrashed = true;
  }
};

export const scheduleUpdate = (renderDispatch: CustomRenderDispatch) => {
  let nextWorkFiber: MyReactFiberNode | null = null;

  if (enableLoopFromRoot.current) {
    const allLive = renderDispatch.pendingUpdateFiberArray.getAll().filter((f) => !(f.state & STATE_TYPE.__unmount__));

    const hasSync = allLive.some((f) => f.state & (STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__));

    renderDispatch.pendingUpdateFiberArray.clear();

    if (allLive.length) {
      renderDispatch.runtimeFiber.scheduledFiber = renderDispatch.rootFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = renderDispatch.rootFiber;

      if (hasSync) {
        updateSyncWithSkip(renderDispatch, () => scheduleUpdate(renderDispatch));
      } else {
        updateConcurrentWithSkip(renderDispatch, () => scheduleUpdate(renderDispatch));
      }
    }
  } else {
    while (!nextWorkFiber && renderDispatch.pendingUpdateFiberArray.length) {
      const tempFiber = renderDispatch.pendingUpdateFiberArray.uniShift();

      if (tempFiber.state & (STATE_TYPE.__stable__ | STATE_TYPE.__unmount__)) continue;

      nextWorkFiber = tempFiber;
    }

    if (nextWorkFiber) {
      if (nextWorkFiber.state & (STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (nextWorkFiber.state & STATE_TYPE.__triggerSync__) {
          updateSyncWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else if (enableConcurrentMode.current) {
          updateConcurrentWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else {
          updateSyncWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
        }
      } else if (nextWorkFiber.state & (STATE_TYPE.__skippedSync__ | STATE_TYPE.__skippedConcurrent__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (nextWorkFiber.state & STATE_TYPE.__skippedSync__) {
          updateSyncWithSkip(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else if (enableConcurrentMode.current) {
          updateConcurrentWithSkip(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else {
          updateSyncWithSkip(renderDispatch, () => scheduleUpdate(renderDispatch));
        }
      } else {
        // TODO
        throw new Error(`un handler state, ${nextWorkFiber.state}`);
      }
    } else {
      globalLoop.current = false;

      renderDispatch.runtimeFiber.scheduledFiber = null;

      renderDispatch.runtimeFiber.nextWorkingFiber = null;

      renderDispatch.pendingCommitFiberList = null;
    }
  }
};

export const triggerUpdate = (fiber: MyReactFiberNode, state: STATE_TYPE) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  if (renderDispatch.isAppCrashed) return;

  if (!renderDispatch.isAppMounted) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber, state));

    return;
  }

  fiber.state === STATE_TYPE.__stable__ ? (fiber.state = state) : (fiber.state |= state);

  renderDispatch.pendingUpdateFiberArray.uniPush(fiber);

  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderDispatch);
};
