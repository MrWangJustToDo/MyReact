import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

const { enableSyncFlush } = __my_react_shared__;

export const safeCall = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    if (fiber) {
      const renderPlatform = fiber.root.renderPlatform;

      renderPlatform.log({ message: e as Error, level: "error", fiber });

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

    if (fiber) {
      const renderPlatform = fiber.root.renderPlatform;

      renderPlatform.log({ message: e as Error, level: "error", fiber });

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
    const renderPlatform = fiber.root.renderPlatform;

    renderPlatform.log({ message: e as Error, level: "error", fiber });

    fiber._error(e);
  }
};

export const safeCallWithFlushSync = <T extends any[] = any[], K = any>(action: (...args: T) => K, ...args: T): K => {
  try {
    enableSyncFlush.current = true;

    return action.call(null, ...args);
  } catch (e) {
    const fiber = currentRunningFiber.current;

    if (fiber) {
      const renderPlatform = fiber.root.renderPlatform;

      renderPlatform.log({ message: e as Error, level: "error", fiber });

      fiber._error(e);
    } else {
      throw e;
    }
  } finally {
    enableSyncFlush.current = false;
  }
};
