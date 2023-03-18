import { NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const defaultGenerateSuspenseMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactElementNode>) => {
  const parent = fiber.parent;

  if (parent) {
    if (parent.type & NODE_TYPE.__isSuspenseNode__) {
      const fallback = parent.pendingProps["fallback"] as MyReactElementNode;

      map.set(fiber, fallback);
    } else {
      const fallbackElement = map.get(parent);

      fallbackElement && map.set(fiber, fallbackElement);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const fallbackElement = map.get(fiber);

    fallbackElement && (typedFiber._debugSuspense = fallbackElement);
  }
};