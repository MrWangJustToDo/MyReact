import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { MyReactFiberNode, devErrorWithFiber, devWarnWithFiber, onceErrorWithKeyAndFiber, onceWarnWithKeyAndFiber } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

import type { RenderContainer } from "@my-react-dom-client/mount";

const { enableOptimizeTreeLog } = __my_react_shared__;

/**
 * @internal
 */
export const log = (fiber: MyReactFiberNode, level: "warn" | "error", ...rest: any) => {
  if (__DEV__) {
    const last = enableOptimizeTreeLog.current;

    enableOptimizeTreeLog.current = false;

    if (level === "warn") {
      devWarnWithFiber(fiber, `[@my-react/react-dom]`, ...rest);
    }
    if (level === "error") {
      devErrorWithFiber(fiber, `[@my-react/react-dom]`, ...rest);
    }

    enableOptimizeTreeLog.current = last;

    return;
  }

  if (level === "error") {
    console.error(`[@my-react/react-dom]`, ...rest);
  }
};

const onceMap: Record<string, boolean> = {};

/**
 * @internal
 */
export const logOnce = (fiber: MyReactFiberNode, level: "warn" | "error", key: string, ...rest: any) => {
  if (__DEV__) {
    if (level === "warn") {
      onceWarnWithKeyAndFiber(fiber, key, `[@my-react/react-dom]`, ...rest);
    }
    if (level === "error") {
      onceErrorWithKeyAndFiber(fiber, key, `[@my-react/react-dom]`, ...rest);
    }
    return;
  }

  if (level === "error") {
    if (onceMap[key]) return;

    onceMap[key] = true;

    console.error(`[@my-react/react-dom]`, ...rest);
  }
};

/**
 * @internal
 */
export const prepareDevContainer = (renderDispatch: ClientDomDispatch) => {
  Reflect.defineProperty(renderDispatch, "_dev_shared", { value: __my_react_shared__ });
  Reflect.defineProperty(renderDispatch, "_dev_internal", { value: __my_react_internal__ });
};

/**
 * @internal
 */
export const checkRehydrate = (container: Partial<RenderContainer>) => {
  const rootFiber = container.__fiber__;

  const rootContainer = container.__container__;

  if (rootFiber instanceof MyReactFiberNode || rootContainer instanceof ClientDomDispatch) {
    throw new Error(`[@my-react/react-dom] hydrate error, current container have been hydrated`);
  }
};
