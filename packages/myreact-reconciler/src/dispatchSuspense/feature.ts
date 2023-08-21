import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";

export const defaultGenerateSuspenseMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactElementNode>) => {
  const parent = fiber.parent;

  if (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      let fallback = parent.pendingProps["fallback"] as MyReactElementNode;

      fallback = fallback || map.get(parent);

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
