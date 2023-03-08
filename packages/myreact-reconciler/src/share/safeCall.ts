import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

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
