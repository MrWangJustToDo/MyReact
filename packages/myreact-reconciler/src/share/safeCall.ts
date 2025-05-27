import { __my_react_internal__ } from "@my-react/react";

import { currentCallingFiber, globalError } from "./env";
import { afterSyncUpdate, beforeSyncUpdate } from "./sync";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber, currentScheduler, currentScopeFiber } = __my_react_internal__;

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentCallingFiber.current || currentScopeFiber.current || currentRunningFiber.current;

    const renderScheduler = currentScheduler.current;

    globalError.current = globalError.current || e;

    renderScheduler.dispatchError({ fiber, error: globalError.current });
  }
};

const stack: MyReactFiberNode[] = [];

export const safeCallWithCurrentFiber = <T extends any[] = any[], K = any>(
  { action, fiber, fallback }: { action: (...args: T) => K; fiber: MyReactFiberNode; fallback?: () => K },
  ...args: T
): K => {
  stack.push(fiber);

  currentCallingFiber.current = fiber;

  try {
    return action.call(null, ...args);
  } catch (e) {
    if (fallback) {
      return fallback();
    } else {
      const renderScheduler = currentScheduler.current;

      globalError.current = globalError.current || e;

      renderScheduler.dispatchError({ fiber, error: globalError.current });
    }
  } finally {
    const l = stack.pop();

    currentCallingFiber.current = l;
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
    const fiber = currentCallingFiber.current || currentScopeFiber.current || currentRunningFiber.current;

    const renderScheduler = currentScheduler.current;

    globalError.current = globalError.current || e;

    renderScheduler.dispatchError({ fiber, error: globalError.current });
  } finally {
    afterSyncUpdate();
  }
};
