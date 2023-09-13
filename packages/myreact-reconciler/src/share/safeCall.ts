import { __my_react_internal__ } from "@my-react/react";

import { afterSyncUpdate, beforeSyncUpdate } from "./sync";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber, currentRenderPlatform } = __my_react_internal__;

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.dispatchError({ fiber, error: e });
  }
};

export const safeCallWithFiber = <T extends any[] = any[], K = any>(
  { action, fiber, fallback }: { action: (...args: T) => K; fiber: MyReactFiberNode; fallback?: () => K },
  ...args: T
): K => {
  const last = currentRunningFiber.current;

  currentRunningFiber.current = fiber;
  try {
    return action.call(null, ...args);
  } catch (e) {
    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.dispatchError({ fiber, error: e });

    return fallback?.();
  } finally {
    currentRunningFiber.current = last;
  }
};

export const safeCallWithSync = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    beforeSyncUpdate();

    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.dispatchError({ fiber, error: e });
  } finally {
    afterSyncUpdate();
  }
};
