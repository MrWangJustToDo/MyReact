import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { STATE_TYPE, exclude, include, merge } from "@my-react/react-shared";

import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { unmountFiber } from "../dispatchUnmount";
import { currentTriggerFiber, devError, devWarn, fiberToDispatchMap } from "../share";

import { updateConcurrentWithAll, updateConcurrentWithTrigger, updateSyncWithAll, updateSyncWithTrigger } from "./feature";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

const { globalLoop, currentRenderPlatform, currentRunningFiber } = __my_react_internal__;

const { enableConcurrentMode, enableLoopFromRoot } = __my_react_shared__;

const scheduleNext = (renderDispatch: CustomRenderDispatch) => {
  if (!renderDispatch.isAppUnmounted && !renderDispatch.isAppCrashed && renderDispatch.enableUpdate && renderDispatch.pendingUpdateFiberArray.length) {
    scheduleUpdate(renderDispatch);
    return;
  }

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  if (!renderPlatform.dispatchSet || renderPlatform.dispatchSet?.length === 1) return;

  const allDispatch = renderPlatform.dispatchSet;

  const hasPending = allDispatch
    .getAll()
    .find((d) => d !== renderDispatch && d.isAppMounted && d.enableUpdate && !d.isAppCrashed && !d.isAppUnmounted && d.pendingUpdateFiberArray.length);

  if (hasPending) {
    scheduleUpdate(hasPending);
  }
};

const scheduleUpdate = (renderDispatch: CustomRenderDispatch) => {
  let nextWorkFiber: MyReactFiberNode | null = null;

  let nextWorkSyncFiber: MyReactFiberNode | null = null;

  if (renderDispatch.isAppUnmounted) {
    scheduleNext(renderDispatch);
    return;
  }

  if (enableLoopFromRoot.current) {
    const allLive = renderDispatch.pendingUpdateFiberArray.getAll().filter((f) => exclude(f.state, STATE_TYPE.__unmount__));

    const hasSync = allLive.some((f) => include(f.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__));

    renderDispatch.pendingUpdateFiberArray.clear();

    if (allLive.length) {
      renderDispatch.runtimeFiber.scheduledFiber = renderDispatch.rootFiber;

      if (__DEV__) currentTriggerFiber.current = renderDispatch.rootFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = renderDispatch.rootFiber;

      if (hasSync) {
        updateSyncWithAll(renderDispatch, () => scheduleNext(renderDispatch));
      } else {
        updateConcurrentWithAll(renderDispatch, () => scheduleNext(renderDispatch));
      }
    } else {
      scheduleNext(renderDispatch);
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
          updateSyncWithAll(renderDispatch, () => scheduleNext(renderDispatch));
        } else {
          updateSyncWithTrigger(renderDispatch, () => scheduleNext(renderDispatch));
        }
      } else if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__ | STATE_TYPE.__triggerConcurrent__)) {
        renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

        if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

        renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

        if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__)) {
          if (enableConcurrentMode.current) {
            updateConcurrentWithAll(renderDispatch, () => scheduleNext(renderDispatch));
          } else {
            updateSyncWithAll(renderDispatch, () => scheduleNext(renderDispatch));
          }
        } else {
          if (enableConcurrentMode.current) {
            updateConcurrentWithTrigger(renderDispatch, () => scheduleNext(renderDispatch));
          } else {
            updateSyncWithTrigger(renderDispatch, () => scheduleNext(renderDispatch));
          }
        }
      } else {
        // TODO
        throw new Error(`[@my-react/react] unknown state, ${nextWorkFiber.state}, ${nextWorkFiber}`);
      }
    } else {
      globalLoop.current = false;

      renderDispatch.resetUpdateFlowRuntimeFiber();

      if (__DEV__) currentTriggerFiber.current = null;

      renderDispatch.pendingCommitFiberList = null;

      scheduleNext(renderDispatch);
    }
  }
};

/**
 * only used for dev HMR
 * only invoke on the errorCatchFiber
 */
export const triggerRevert = (fiber: MyReactFiberNode, cb?: () => void) => {
  if (__DEV__) {
    if (!isErrorBoundariesComponent(fiber)) return;

    const renderDispatch = fiberToDispatchMap.get(fiber);

    const instance = fiber.instance as MyReactComponent;

    instance?.setState(fiber.memoizedState, () => {
      renderDispatch.runtimeFiber.errorCatchFiber = null;

      fiber.memoizedState = null;

      cb?.();
    });
  } else {
    console.error(`[@my-react/react] can not call revert on prod mode`);
  }
};

export const triggerUpdate = (fiber: MyReactFiberNode, state?: STATE_TYPE, cb?: () => void) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderPlatform = currentRenderPlatform.current;

  const renderDispatch = fiberToDispatchMap.get(fiber);

  if (renderDispatch.isAppCrashed) return;

  if (renderDispatch.isAppUnmounted) return;

  if (!renderDispatch.isAppMounted) {
    if (__DEV__) devWarn("[@my-react/react] pending, can not update component,", fiber);

    renderPlatform.macroTask(() => triggerUpdate(fiber, state, cb));

    return;
  }

  if (typeof state === "function") {
    cb = state;

    state = STATE_TYPE.__triggerConcurrent__;
  }

  state = state || STATE_TYPE.__triggerSync__;

  if (fiber.state === STATE_TYPE.__stable__) {
    fiber.state = state;
  } else {
    fiber.state = merge(fiber.state, state);
  }

  fiber.mode = 1;

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
    const typedComponent = errorBoundariesFiber.elementType as MixinMyReactClassComponent;

    const typedInstance = errorBoundariesFiber.instance as MyReactComponent;

    const payloadState = typedComponent.getDerivedStateFromError?.(error);

    errorBoundariesFiber.memoizedState = Object.assign({}, errorBoundariesFiber.pendingState.pendingState);

    typedInstance.setState(payloadState, () => {
      typedInstance.componentDidCatch?.(error, { componentStack: renderPlatform.getFiberTree(fiber) });

      renderDispatch.runtimeFiber.errorCatchFiber = errorBoundariesFiber;

      cb?.();
    });
  } else {
    renderDispatch.pendingUpdateFiberArray.clear();

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.isAppCrashed = true;

    if (__DEV__) {
      const rootFiber = renderDispatch.rootFiber;

      currentTriggerFiber.current = null;

      const last = currentRunningFiber.current;

      currentRunningFiber.current = fiber;

      devError(`[@my-react/react] a uncaught exception have been throw, current App will been unmount`);

      currentRunningFiber.current = last;

      unmountFiber(rootFiber);

      cb?.();

      throw error;
    } else {
      throw error;
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
