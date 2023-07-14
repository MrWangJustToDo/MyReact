import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { unmountFiber } from "../dispatchUnmount";
import { fiberToDispatchMap } from "../share";

import { updateConcurrentWithAll, updateConcurrentWithTrigger, updateSyncWithAll, updateSyncWithTrigger } from "./feature";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode, PendingStateTypeWithError } from "../runtimeFiber";
import type { MyReactComponent } from "@my-react/react";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableConcurrentMode, enableLoopFromRoot } = __my_react_shared__;

export const triggerError = (fiber: MyReactFiberNode, error: Error, cb?: () => void) => {
  const renderDispatch = fiberToDispatchMap.get(fiber);

  const renderPlatform = currentRenderPlatform.current;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    const typedInstance = errorBoundariesFiber.instance as MyReactComponent;

    const typedPendingState = errorBoundariesFiber.pendingState as PendingStateTypeWithError;

    // prepare error catch flow
    typedPendingState.error = {
      error,
      stack: renderPlatform.getFiberTree(fiber),
      revertState: Object.assign({}, typedInstance.state),
    };

    triggerUpdate(errorBoundariesFiber, STATE_TYPE.__triggerSync__, cb);
  } else {
    renderDispatch.pendingUpdateFiberArray.clear();

    renderDispatch.runtimeFiber.scheduledFiber = null;

    renderDispatch.runtimeFiber.nextWorkingFiber = null;

    renderDispatch.isAppCrashed = true;

    const rootFiber = renderDispatch.rootFiber;

    unmountFiber(rootFiber);

    console.error(`[@my-react/react] a uncaught exception have been throw, current App will been unmount`);
  }
};

/**
 * only used for dev HMR
 */
export const triggerRevert = (fiber: MyReactFiberNode) => {
  if (__DEV__) {
    const renderDispatch = fiberToDispatchMap.get(fiber);

    const errorBoundariesFiber = renderDispatch.runtimeFiber.errorCatchFiber;

    if (errorBoundariesFiber) {
      const instance = errorBoundariesFiber.instance as MyReactComponent;

      instance?.setState(errorBoundariesFiber.memoizedState?.revertState, () => {
        renderDispatch.runtimeFiber.errorCatchFiber = null;
        errorBoundariesFiber.memoizedState.revertState = null;
      });
    } else {
      // there are not a ErrorBoundariesFiber
      console.warn(`[@my-react/react] there are not a ErrorBoundary Component, try to remount current App`);

      renderDispatch.remountOnDev?.();
    }
  } else {
    console.error(`[@my-react/react] can not call revert on prod mode`);
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
        updateSyncWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
      } else {
        updateConcurrentWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
      }
    }
  } else {
    while (!nextWorkFiber && renderDispatch.pendingUpdateFiberArray.length) {
      const tempFiber = renderDispatch.pendingUpdateFiberArray.uniShift();

      if (tempFiber.state & (STATE_TYPE.__stable__ | STATE_TYPE.__unmount__)) continue;

      nextWorkFiber = tempFiber;
    }

    if (nextWorkFiber) {
      if (nextWorkFiber.state & (STATE_TYPE.__skippedSync__ | STATE_TYPE.__skippedConcurrent__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (nextWorkFiber.state & STATE_TYPE.__skippedSync__) {
          updateSyncWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else if (enableConcurrentMode.current) {
          updateConcurrentWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else {
          updateSyncWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
        }
      } else if (nextWorkFiber.state & (STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerConcurrent__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (nextWorkFiber.state & STATE_TYPE.__triggerSync__) {
          updateSyncWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else if (enableConcurrentMode.current) {
          updateConcurrentWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else {
          updateSyncWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
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

export const triggerUpdate = (fiber: MyReactFiberNode, state: STATE_TYPE, cb?: () => void) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  if (renderDispatch.isAppCrashed) return;

  if (!renderDispatch.isAppMounted) {
    if (__DEV__) console.log("pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber, state, cb));

    return;
  }

  fiber.state === STATE_TYPE.__stable__ ? (fiber.state = state) : fiber.state & state ? void 0 : (fiber.state |= state);

  renderDispatch.pendingUpdateFiberArray.uniPush(fiber);

  cb && renderDispatch.pendingEffect(fiber, cb);

  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderDispatch);
};
