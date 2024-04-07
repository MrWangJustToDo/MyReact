import { __my_react_shared__ } from "@my-react/react";
import { devErrorWithFiber, devWarnWithFiber } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { enableOptimizeTreeLog } = __my_react_shared__;

/**
 * @internal
 */
export const log = (fiber: MyReactFiberNode, level: "warn" | "error", ...rest: any) => {
  if (__DEV__) {
    const last = enableOptimizeTreeLog.current;

    enableOptimizeTreeLog.current = false;

    if (level === "warn") {
      devWarnWithFiber(fiber, `[@my-react/react-terminal]`, ...rest);
    }
    if (level === "error") {
      devErrorWithFiber(fiber, `[@my-react/react-terminal]`, ...rest);
    }

    enableOptimizeTreeLog.current = last;

    return;
  }

  if (level === "error") {
    console.error(`[@my-react/react-terminal]`, ...rest);
  }
};
