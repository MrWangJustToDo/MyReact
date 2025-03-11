import { __my_react_shared__ } from "@my-react/react";
import { devWarnWithFiber, devErrorWithFiber, onceWarnWithKeyAndFiber, onceErrorWithKeyAndFiber } from "@my-react/react-reconciler";

import type { MyReactFiberNode} from "@my-react/react-reconciler";

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
export const logOnce = (fiber: MyReactFiberNode, level: "warn" | "error", key: string, ...rest: string[]) => {
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