import { __my_react_shared__, type MyReactElementNode } from "@my-react/react";
import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";

const { enableDebugFiled } = __my_react_shared__;

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

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const fallbackElement = map.get(fiber);

    fallbackElement && (typedFiber._debugSuspense = fallbackElement);
  }
};
