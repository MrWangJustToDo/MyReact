import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { MyReactFiberNode, devError, devWarn } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";

import type { RenderContainer } from "@my-react-dom-client/mount";

const { currentRunningFiber } = __my_react_internal__;

/**
 * @internal
 */
export const log = (fiber: MyReactFiberNode, level: "warn" | "error", ...rest: any) => {
  if (__DEV__) {
    const last = currentRunningFiber.current;

    currentRunningFiber.current = fiber;
    if (level === "warn") {
      devWarn(`[@my-react/react-dom]`, ...rest);
    }
    if (level === "error") {
      devError(`[@my-react/react-dom]`, ...rest);
    }
    currentRunningFiber.current = last;
    return;
  }

  // if (level === "warn") {
  //   console.warn(`[@my-react/react-dom]`, ...rest);
  // }
  if (level === "error") {
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
