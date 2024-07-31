import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { MODE_TYPE, STATE_TYPE, exclude, include, merge } from "@my-react/react-shared";

import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { unmountFiber } from "../renderUnmount";
import { NODE_TYPE, currentDevFiber, currentTriggerFiber, devError, devWarnWithFiber, fiberToDispatchMap } from "../share";

import { updateConcurrentFromRoot, updateConcurrentFromTrigger, updateSyncFromRoot, updateSyncFromTrigger } from "./feature";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

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
  } else {
    globalLoop.current = false;
  }
};

const scheduleUpdateFromRoot = (renderDispatch: CustomRenderDispatch) => {
  const allLive = renderDispatch.pendingUpdateFiberArray.getAll().filter((f) => exclude(f.state, STATE_TYPE.__unmount__));

  function scheduleNextUpdate() {
    scheduleNext(renderDispatch);
  }

  renderDispatch.pendingUpdateFiberArray.clear();

  if (allLive.length) {
    renderDispatch.runtimeFiber.scheduledFiber = renderDispatch.rootFiber;

    renderDispatch.runtimeFiber.nextWorkingFiber = renderDispatch.rootFiber;

    if (__DEV__) currentTriggerFiber.current = renderDispatch.rootFiber;

    if (
      !enableConcurrentMode.current ||
      allLive.some((f) => include(f.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__))
    ) {
      updateSyncFromRoot(renderDispatch, scheduleNextUpdate);
    } else {
      updateConcurrentFromRoot(renderDispatch, scheduleNextUpdate);
    }
  } else {
    if (__DEV__) currentTriggerFiber.current = null;

    scheduleNextUpdate();
  }
};

const scheduleUpdateFromTrigger = (renderDispatch: CustomRenderDispatch) => {
  function scheduleNextUpdate() {
    scheduleNext(renderDispatch);
  }

  const allPending = renderDispatch.pendingUpdateFiberArray.getAll();

  let nextWorkFiber: MyReactFiberNode | null = null;

  for (let i = 0; i < allPending.length; i++) {
    const item = allPending[i];

    if (include(item.state, STATE_TYPE.__stable__ | STATE_TYPE.__unmount__)) {
      renderDispatch.pendingUpdateFiberArray.uniDelete(item);
      continue;
    } else {
      nextWorkFiber = item;
      break;
    }
  }

  if (nextWorkFiber) {
    if (include(nextWorkFiber.state, STATE_TYPE.__skippedSync__ | STATE_TYPE.__triggerSync__ | STATE_TYPE.__triggerSyncForce__)) {
      renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

      if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

      // normally a context update
      if (include(nextWorkFiber.state, STATE_TYPE.__skippedSync__)) {
        updateSyncFromRoot(renderDispatch, scheduleNextUpdate);
      } else {
        // TODO maybe could use `updateSyncFromRoot`?
        updateSyncFromTrigger(renderDispatch, scheduleNextUpdate);
      }
    } else if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__ | STATE_TYPE.__triggerConcurrent__ | STATE_TYPE.__triggerConcurrentForce__)) {
      renderDispatch.runtimeFiber.scheduledFiber = nextWorkFiber;

      if (__DEV__) currentTriggerFiber.current = nextWorkFiber;

      renderDispatch.runtimeFiber.nextWorkingFiber = nextWorkFiber;

      if (include(nextWorkFiber.state, STATE_TYPE.__skippedConcurrent__)) {
        if (enableConcurrentMode.current) {
          updateConcurrentFromRoot(renderDispatch, scheduleNextUpdate);
        } else {
          updateSyncFromRoot(renderDispatch, scheduleNextUpdate);
        }
      } else {
        if (enableConcurrentMode.current) {
          updateConcurrentFromTrigger(renderDispatch, scheduleNextUpdate);
        } else {
          updateSyncFromTrigger(renderDispatch, scheduleNextUpdate);
        }
      }
    } else {
      // TODO
      throw new Error(`[@my-react/react] unknown state, ${nextWorkFiber.state}, this like a bug for @my-react`);
    }
  } else {
    if (__DEV__) currentTriggerFiber.current = null;

    scheduleNextUpdate();
  }
};

const scheduleUpdate = (renderDispatch: CustomRenderDispatch) => {
  if (renderDispatch.isAppUnmounted) {
    scheduleNext(renderDispatch);
    return;
  }

  if (enableLoopFromRoot.current) {
    scheduleUpdateFromRoot(renderDispatch);
  } else {
    scheduleUpdateFromTrigger(renderDispatch);
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

  // TODO
  if (!renderDispatch.isAppMounted) {
    if (__DEV__) devWarnWithFiber(fiber, "[@my-react/react] pending, waiting for app mounted");

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

  fiber.mode = MODE_TYPE.__stable__;

  renderDispatch.pendingUpdateFiberArray.uniPush(fiber);

  if (cb) {
    if (include(fiber.type, NODE_TYPE.__class__)) {
      renderDispatch.pendingLayoutEffect(fiber, cb, { stickyToFoot: true });
    } else {
      renderDispatch.pendingEffect(fiber, cb, { stickyToFoot: true });
    }
  }

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

    errorBoundariesFiber.memoizedState = Object.assign({}, errorBoundariesFiber.pendingState);

    typedInstance.setState(payloadState, () => {
      typedInstance.componentDidCatch?.(error, { componentStack: renderPlatform.getFiberTree(fiber) });

      renderDispatch.runtimeFiber.errorCatchFiber = errorBoundariesFiber;

      cb?.();
    });
  } else {
    if (renderDispatch.isAppCrashed) return;

    renderDispatch.pendingUpdateFiberArray.clear();

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.isAppCrashed = true;

    globalLoop.current = false;

    if (__DEV__) {
      const rootFiber = renderDispatch.rootFiber;

      currentTriggerFiber.current = null;

      currentDevFiber.current = fiber;

      devError(`[@my-react/react] a uncaught exception have been throw, current App will been unmount`);

      currentDevFiber.current = null;

      unmountFiber(rootFiber);

      cb?.();

      throw error;
    } else {
      console.error(`[@my-react/react] a uncaught exception have been throw`, error);

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
    renderDispatch.reconcileUnmount();

    cb?.();

    if (__DEV__) currentTriggerFiber.current = null;
  });
};
