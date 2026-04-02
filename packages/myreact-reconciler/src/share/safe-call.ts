import { __my_react_internal__ } from "@my-react/react";

import { afterSyncUpdate, beforeSyncUpdate } from "./sync";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber, currentScheduler, currentScopeFiber, currentError, currentCallingFiber } = __my_react_internal__;

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentCallingFiber?.[currentCallingFiber?.length - 1] || currentScopeFiber.current || currentRunningFiber.current;

    const renderScheduler = currentScheduler.current;

    currentError.current = currentError.current || e;

    renderScheduler.dispatchError({ fiber, error: currentError.current });
  }
};

export const safeCallWithCurrentFiber = <T extends any[] = any[], K = any>(
  { action, fiber, fallback }: { action: (...args: T) => K; fiber: MyReactFiberNode; fallback?: () => K },
  ...args: T
): K => {
  currentCallingFiber.push(fiber);

  try {
    return action.call(null, ...args);
  } catch (e) {
    if (fallback) {
      return fallback();
    } else {
      const renderScheduler = currentScheduler.current;

      currentError.current = currentError.current || e;

      renderScheduler.dispatchError({ fiber, error: currentError.current });
    }
  } finally {
    currentCallingFiber.pop();
  }
};

export const callWithFiber = <T extends any[] = any[], K = any>({ action, fiber }: { action: (...args: T) => K; fiber: MyReactFiberNode }, ...args: T): K => {
  currentScopeFiber.current = fiber;
  try {
    return action.call(null, ...args);
  } finally {
    currentScopeFiber.current = null;
  }
};

export const safeCallWithSync = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    beforeSyncUpdate();

    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentCallingFiber?.[currentCallingFiber?.length - 1] || currentScopeFiber.current || currentRunningFiber.current;

    const renderScheduler = currentScheduler.current;

    currentError.current = currentError.current || e;

    renderScheduler.dispatchError({ fiber, error: currentError.current });
  } finally {
    afterSyncUpdate();
  }
};
