import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "../runtimeFiber";

const { currentRunningFiber, currentRenderPlatform } = __my_react_internal__;

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    const renderPlatform = currentRenderPlatform.current;

    renderPlatform.log({ message: e as Error, level: "error", fiber });

    if (fiber) {
      fiber._error(e);
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
      fiber._error(e);
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

    fiber._error(e);
  }
};
