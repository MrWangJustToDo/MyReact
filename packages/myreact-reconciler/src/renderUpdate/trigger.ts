import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, exclude, include, merge } from "@my-react/react-shared";

import { unmountFiber } from "../dispatchUnmount";
import { currentTriggerFiber, fiberToDispatchMap } from "../share";

import { updateConcurrentWithAll, updateConcurrentWithTrigger, updateSyncWithAll, updateSyncWithTrigger } from "./feature";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode, PendingStateTypeWithError } from "../runtimeFiber";
import type { MyReactComponent } from "@my-react/react";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

const { enableConcurrentMode, enableLoopFromRoot } = __my_react_shared__;

const scheduleUpdate = (renderDispatch: CustomRenderDispatch) => {
  let nextWorkFiber: MyReactFiberNode | null = null;

  let nextWorkSyncFiber: MyReactFiberNode | null = null;

  if (renderDispatch.isAppUnmounted) return;

  if (enableLoopFromRoot.current) {
    const allLive = renderDispatch.pendingUpdateFiberArray.getAll().filter((f) => exclude(f.state, STATE_TYPE.__unmount__));

    const hasSync = allLive.some((f) => include(f.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__));

    renderDispatch.pendingUpdateFiberArray.clear();

    if (allLive.length) {
      renderDispatch.runtimeFiber.scheduledFiber = renderDispatch.rootFiber;

      if (__DEV__) currentTriggerFiber.current = renderDispatch.rootFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = renderDispatch.rootFiber;

      if (hasSync) {
        updateSyncWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
      } else {
        updateConcurrentWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
      }
    }
  } else {
    const allPending = renderDispatch.pendingUpdateFiberArray.getAll();

    for (let i = 0; i < allPending.length; i++) {
      if (nextWorkFiber && nextWorkSyncFiber) break;

      const item = allPending[i];

      if (include(item.state, STATE_TYPE.__stable__ | STATE_TYPE.__unmount__)) {
        renderDispatch.pendingUpdateFiberArray.uniDelete(item);
        continue;
      }

      if (!nextWorkFiber) nextWorkFiber = item;

      if (!nextWorkSyncFiber && include(item.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__)) nextWorkSyncFiber = item;
    }

    nextWorkFiber = nextWorkSyncFiber || nextWorkFiber;

    if (nextWorkFiber) {
      if (include(nextWorkFiber.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (include(nextWorkFiber.state, STATE_TYPE.__skippedSync__)) {
          updateSyncWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
        } else {
          updateSyncWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
        }
      } else if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__ | STATE_TYPE.__triggerConcurrent__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__)) {
          if (enableConcurrentMode.current) {
            updateConcurrentWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
          } else {
            updateSyncWithAll(renderDispatch, () => scheduleUpdate(renderDispatch));
          }
        } else {
          if (enableConcurrentMode.current) {
            updateConcurrentWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
          } else {
            updateSyncWithTrigger(renderDispatch, () => scheduleUpdate(renderDispatch));
          }
        }
      } else {
        // TODO
        throw new Error(`[@my-react/react] unknown state, ${nextWorkFiber.state}, ${nextWorkFiber}`);
      }
    } else {
      globalLoop.current = false;

      renderDispatch.runtimeFiber.scheduledFiber = null;

      if (__DEV__) currentTriggerFiber.current = null;

      renderDispatch.runtimeFiber.nextWorkingFiber = null;

      renderDispatch.pendingCommitFiberList = null;
    }
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

export const triggerUpdate = (fiber: MyReactFiberNode, state?: STATE_TYPE, cb?: () => void) => {
  const renderPlatform = currentRenderPlatform.current;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  if (renderDispatch.isAppCrashed) return;

  if (renderDispatch.isAppUnmounted) return;

  if (!renderDispatch.isAppMounted) {
    if (__DEV__) console.log("[@my-react/react] pending, can not update component");

    renderPlatform.macroTask(() => triggerUpdate(fiber, state, cb));

    return;
  }

  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  if (state !== undefined && state !== STATE_TYPE.__stable__) {
    if (fiber.state === STATE_TYPE.__stable__) {
      fiber.state = state;
    } else {
      fiber.state = merge(fiber.state, state);
    }
  }

  renderDispatch.pendingUpdateFiberArray.uniPush(fiber);

  cb && renderDispatch.pendingEffect(fiber, cb);

  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderDispatch);
};

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

    if (__DEV__) {
      const rootFiber = renderDispatch.rootFiber;

      currentTriggerFiber.current = null;

      unmountFiber(rootFiber);

      console.error(`[@my-react/react] a uncaught exception have been throw, current App will been unmount`);
    }
  }
};

export const triggerUnmount = (fiber: MyReactFiberNode, cb?: () => void) => {
  const renderDispatch = fiberToDispatchMap.get(fiber);

  if (renderDispatch.isAppUnmounted) {
    throw new Error(`[@my-react/react] can not unmount a node when current app has been unmounted`);
  }

  triggerUpdate(fiber, STATE_TYPE.__skippedSync__, () => {
    unmountFiber(fiber);

    cb?.();

    if (__DEV__) currentTriggerFiber.current = null;
  });
};
