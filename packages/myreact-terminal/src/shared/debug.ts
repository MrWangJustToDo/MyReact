import { __my_react_internal__ } from "@my-react/react";
import { getFiberTree, originalError, originalWarn } from "@my-react/react-reconciler";

import type { LogProps } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { currentRunningFiber } = __my_react_internal__;

const cache: Record<string, Record<string, boolean>> = {};

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
        tree
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
        fiber
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
    originalWarn(`${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`);
  }
  if (level === "error") {
    originalError(`${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`);
  }
};
