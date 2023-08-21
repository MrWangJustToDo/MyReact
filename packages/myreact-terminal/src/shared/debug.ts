import { __my_react_internal__ } from "@my-react/react";
import { devError, devWarn } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

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

  if (level === "warn") {
    console.warn(`[@my-react/react-dom]`, ...rest);
  }
  if (level === "error") {
    console.error(`[@my-react/react-dom]`, ...rest);
  }
};
