import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { getFiberNodeName, getFiberTree, getRenderFiber, originalError, originalWarn } from "@my-react/react-reconciler";

import type { LogProps } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client";

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
  const renderFiber = getRenderFiber(currentFiber as MyReactFiberNode);
  const tree = renderFiber ? getFiberNodeName(renderFiber) : "<unknown />";
  if (triggerOnce) {
    const messageKey = message.toString();
    cache[messageKey] = cache[messageKey] || {};
    if (cache[messageKey][tree]) return;
    cache[messageKey][tree] = true;
  }
  // look like a ts bug
  if (level === "warn") {
    originalWarn(
      `[${level}]:`,
      "\n-----------------------------------------\n",
      `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
      "\n-----------------------------------------\n",
      "render by:",
      tree
    );
  }
  if (level === "error") {
    originalError(
      `[${level}]:`,
      "\n-----------------------------------------\n",
      `${typeof message === "string" ? message : (message as Error).stack || (message as Error).message}`,
      "\n-----------------------------------------\n",
      "render by:",
      tree
    );
  }
};

export const prepareDevContainer = (renderDispatch: ClientDomDispatch) => {
  Reflect.defineProperty(renderDispatch, "_dev_shared", { value: __my_react_shared__ });
  Reflect.defineProperty(renderDispatch, "_dev_internal", { value: __my_react_internal__ });
};
