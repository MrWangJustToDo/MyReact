import { __my_react_internal__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include, merge } from "@my-react/react-shared";

import { defaultDeleteChildEffect } from "../dispatchEffect";
import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { syncFiberStateToComponent } from "../processQueue";
import { processState } from "../processState";
import { unmountContainer } from "../renderUnmount";
import { type MyReactFiberNode } from "../runtimeFiber";
import { NODE_TYPE, currentTriggerFiber, devErrorWithFiber, devWarnWithFiber, fiberToDispatchMap, globalError } from "../share";

import { scheduleUpdate } from "./schedule";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { ComponentUpdateQueue, MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

const { globalLoop, currentRenderPlatform } = __my_react_internal__;

export const applyTriggerFiberCb = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  const cbArray = renderDispatch.runtimeMap.triggerCallbackMap.get(fiber);

  if (include(fiber.type, NODE_TYPE.__class__)) {
    cbArray?.listToFoot?.((cb) => {
      renderDispatch.pendingLayoutEffect(fiber, cb, { stickyToFoot: true });
    });
  } else {
    cbArray?.listToFoot?.((cb) => {
      renderDispatch.pendingEffect(fiber, cb, { stickyToFoot: true });
    });
  }

  renderDispatch.runtimeMap.triggerCallbackMap.delete(fiber);
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

    instance?.setState(fiber.memoizedState, function finishTriggerRevertOnFiber() {
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

  if (!renderDispatch || !renderDispatch.enableUpdate) return;

  if (renderDispatch.isAppCrashed) return;

  if (renderDispatch.isAppUnmounted) return;

  // TODO
  if (!renderDispatch.isAppMounted) {
    if (__DEV__) devWarnWithFiber(fiber, "[@my-react/react] pending, waiting for app mounted");

    renderPlatform.macroTask(function scheduleUpdateBeforeMount() {
      triggerUpdate(fiber, state, cb);
    });

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

  renderDispatch.pendingUpdateFiberArray.uniPush(fiber);

  if (cb) {
    const map = renderDispatch.runtimeMap.triggerCallbackMap;

    const exist = map.get(fiber) || new ListTree();

    exist.push(cb);

    map.set(fiber, exist);
  }

  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderDispatch);
};

// TODO: error flow
// currently only work render flow
// commit flow not work as expected
export const triggerError = (fiber: MyReactFiberNode, error: Error, cb?: () => void) => {
  const renderDispatch = fiberToDispatchMap.get(fiber);

  const renderPlatform = currentRenderPlatform.current;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    defaultDeleteChildEffect(fiber, renderDispatch);

    const typedComponent = errorBoundariesFiber.elementType as MixinMyReactClassComponent;

    const typedInstance = errorBoundariesFiber.instance as MyReactComponent;

    const payloadState = typedComponent.getDerivedStateFromError?.(error);

    if (!errorBoundariesFiber.memoizedState) {
      errorBoundariesFiber.memoizedState = Object.assign({}, errorBoundariesFiber.pendingState);
    }

    if (renderDispatch.runtimeFiber.nextWorkingFiber) {
      const updateQueue: ComponentUpdateQueue = {
        type: UpdateQueueType.component,
        trigger: typedInstance,
        payLoad: payloadState,
        isSync: true,
        isForce: true,
        isRetrigger: true,
        isImmediate: true,
        callback: function finishTriggerErrorOnFiber() {
          typedInstance.componentDidCatch?.(error, { componentStack: renderPlatform.getFiberTree(fiber) });

          renderDispatch.runtimeFiber.errorCatchFiber = errorBoundariesFiber;

          cb?.();

          globalError.current = null;
        },
      };

      errorBoundariesFiber.state = merge(errorBoundariesFiber.state, STATE_TYPE.__create__);

      errorBoundariesFiber.state = merge(errorBoundariesFiber.state, STATE_TYPE.__triggerSyncForce__);

      processState(updateQueue);

      syncFiberStateToComponent(errorBoundariesFiber, renderDispatch);
    } else {
      const updateQueue: ComponentUpdateQueue = {
        type: UpdateQueueType.component,
        trigger: typedInstance,
        payLoad: payloadState,
        isSync: false,
        isForce: true,
        isRetrigger: false,
        isImmediate: false,
        callback: function finishTriggerErrorOnFiber() {
          typedInstance.componentDidCatch?.(error, { componentStack: renderPlatform.getFiberTree(fiber) });

          renderDispatch.runtimeFiber.errorCatchFiber = errorBoundariesFiber;

          cb?.();

          globalError.current = null;
        },
      };

      processState(updateQueue);
    }
  } else {
    if (renderDispatch.isAppCrashed) return;

    renderDispatch.pendingUpdateFiberArray.clear();

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.isAppCrashed = true;

    globalLoop.current = false;

    if (__DEV__) {
      currentTriggerFiber.current = null;

      devErrorWithFiber(fiber, `[@my-react/react] a uncaught exception have been throw, current App will been unmount`);

      unmountContainer(renderDispatch, cb);

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

  triggerUpdate(fiber, STATE_TYPE.__skippedSync__, function finishTriggerUnmountOnFiber() {
    renderDispatch.reconcileUnmount();

    cb?.();

    if (__DEV__) currentTriggerFiber.current = null;
  });
};
