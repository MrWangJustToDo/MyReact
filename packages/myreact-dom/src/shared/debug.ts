import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { getFiberTree, originalError, originalWarn, MyReactFiberNode } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client";

import type { LogProps } from "@my-react/react";
import type { RenderContainer } from "@my-react-dom-client";

const { currentRunningFiber } = __my_react_internal__;

const cache: Record<string, Record<string, boolean>> = {};

/**
 * @internal
 */
export const log = ({ fiber, message, level = "warn", triggerOnce = false }: LogProps) => {
  if (__DEV__) {
    const currentFiber = fiber || currentRunningFiber.current;
    const tree = getFiberTree(currentFiber as MyReactFiberNode);
    if (triggerOnce) {
      const messageKey = message.toString();
      cache[messageKey] = cache[messageKey] || {};
      if (cache[messageKey][tree]) return;
      cache[messageKey][tree] = true;
    }
    if (level === "warn") {
      originalWarn(
        `[${level}]:`,
        "\n-----------------------------------------\n",
        `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
        "\n-----------------------------------------\n",
        "Render Tree:",
        tree,
        "\n-----------------------------------------\n",
        "fiber: ",
        currentFiber
      );
    }
    if (level === "error") {
      originalError(
        `[${level}]:`,
        "\n-----------------------------------------\n",
        `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
        "\n-----------------------------------------\n",
        "Render Tree:",
        tree,
        "\n-----------------------------------------\n",
        "fiber: ",
        currentFiber
      );
    }
    return;
  }
  const currentFiber = fiber || currentRunningFiber.current;
  const tree = getFiberTree(currentFiber as MyReactFiberNode);
  if (triggerOnce) {
    const messageKey = message.toString();
    cache[messageKey] = cache[messageKey] || {};
    if (cache[messageKey][tree]) return;
    cache[messageKey][tree] = true;
  }
  // look like a ts bug
  if (level === "warn") {
    originalWarn(`[@my-react/react-dom] ${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`);
  }
  if (level === "error") {
    originalError(`[@my-react/react-dom] ${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`);
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
    throw new Error(`[@my-react/react] hydrate error, current container have been hydrated`);
  }
};
