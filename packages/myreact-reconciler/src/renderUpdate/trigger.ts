import { __my_react_internal__ } from "@my-react/react";
import { ListTree, STATE_TYPE, UpdateQueueType, include, merge } from "@my-react/react-shared";

import { defaultDeleteChildEffect } from "../dispatchEffect";
import { isErrorBoundariesComponent } from "../dispatchErrorBoundaries";
import { syncFiberStateToComponent } from "../processQueue";
import { processState } from "../processState";
import { unmountContainer } from "../renderUnmount";
import { type MyReactFiberNode } from "../runtimeFiber";
import { NODE_TYPE, currentTriggerFiber, devErrorWithFiber, devWarnWithFiber } from "../share";

import { scheduleUpdate } from "./schedule";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { ComponentUpdateQueue, MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

const { globalLoop, currentScheduler, currentError } = __my_react_internal__;

export const applyTriggerFiberCb = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
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
export const triggerRevert = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, cb?: () => void) => {
  if (__DEV__) {
    if (!isErrorBoundariesComponent(fiber)) return;

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

export const triggerUpdate = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, state?: STATE_TYPE, cb?: () => void) => {
  if (include(fiber.state, STATE_TYPE.__unmount__)) return;

  const renderScheduler = currentScheduler.current;

  if (!renderDispatch || !renderDispatch.enableUpdate) return;

  if (renderDispatch.isAppCrashed) return;

  if (renderDispatch.isAppUnmounted) return;

  // TODO
  if (!renderDispatch.isAppMounted) {
    if (__DEV__) devWarnWithFiber(fiber, "[@my-react/react] pending, waiting for app mounted");

    renderScheduler.macroTask(function scheduleUpdateBeforeMount() {
      triggerUpdate(renderDispatch, fiber, state, cb);
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

  // if (globalLoop.current) {
  //   const nextFiber = renderDispatch.runtimeFiber.nextWorkingFiber;

  //   if (!nextFiber) return;

  //   if (nextFiber.state !== STATE_TYPE.__stable__) {
  //     nextFiber.state = merge(nextFiber.state, state);
  //   }

  //   return;
  // }
  if (globalLoop.current) return;

  globalLoop.current = true;

  scheduleUpdate(renderDispatch);
};

// TODO: error flow
// currently only work render flow
// commit flow not work as expected
export const triggerError = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode, error: Error, cb?: () => void) => {
  const renderScheduler = currentScheduler.current;

  const errorBoundariesFiber = renderDispatch.resolveErrorBoundaries(fiber);

  if (errorBoundariesFiber) {
    defaultDeleteChildEffect(renderDispatch, fiber);

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
          typedInstance.componentDidCatch?.(error, { componentStack: renderScheduler.getFiberTree(fiber) });

          renderDispatch.runtimeFiber.errorCatchFiber = errorBoundariesFiber;

          cb?.();

          currentError.current = null;
        },
      };

      errorBoundariesFiber.state = merge(errorBoundariesFiber.state, STATE_TYPE.__create__);

      errorBoundariesFiber.state = merge(errorBoundariesFiber.state, STATE_TYPE.__triggerSyncForce__);

      processState(renderDispatch, updateQueue);

      syncFiberStateToComponent(renderDispatch, errorBoundariesFiber);
    } else {
      const updateQueue: ComponentUpdateQueue = {
        type: UpdateQueueType.component,
        trigger: typedInstance,
        payLoad: payloadState,
        isSync: true,
        isForce: true,
        isRetrigger: false,
        isImmediate: false,
        callback: function finishTriggerErrorOnFiber() {
          typedInstance.componentDidCatch?.(error, { componentStack: renderScheduler.getFiberTree(fiber) });

          renderDispatch.runtimeFiber.errorCatchFiber = errorBoundariesFiber;

          cb?.();

          currentError.current = null;
        },
      };

      processState(renderDispatch, updateQueue);
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
