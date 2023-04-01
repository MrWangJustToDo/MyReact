import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { triggerError } from "../renderUpdate";

import type { MyReactFiberNode } from "../runtimeFiber";

const { enableSyncFlush } = __my_react_shared__;

const { currentRunningFiber, currentRenderPlatform } = __my_react_internal__;

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.log({ message: e as Error, level: "error", fiber });

    if (fiber) {
      triggerError(fiber as MyReactFiberNode, e);
    } else {
      throw e;
    }
  }
};

export const safeCallAsync = async <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): Promise<K> => {
  try {
    return await action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.log({ message: e as Error, level: "error", fiber });

    if (fiber) {
      triggerError(fiber as MyReactFiberNode, e);
    } else {
      throw e;
    }
  }
};

export const safeCallWithFiber = <T extends any[] = any[], K = any>(
  { action, fiber }: { action: (...args: T) => K; fiber: MyReactFiberNode },
  ...args: T
): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.log({ message: e as Error, level: "error", fiber });

    triggerError(fiber, e);
  }
};

export const safeCallWithSync = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    enableSyncFlush.current = true;
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.log({ message: e as Error, level: "error", fiber });

    if (fiber) {
      triggerError(fiber as MyReactFiberNode, e);
    } else {
      throw e;
    }
  } finally {
    enableSyncFlush.current = false;
  }
};
