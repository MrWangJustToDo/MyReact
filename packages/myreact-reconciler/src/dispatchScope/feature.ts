import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactFiberNode } from "@my-react/react";

export const defaultGenerateScopeMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode>) => {
  const parent = fiber.parent;

  if (parent) {
    if (parent.type & NODE_TYPE.__isScopeNode__) {
      map.set(fiber, parent);
    } else {
      const parentScopeFiber = map.get(parent);

      parentScopeFiber && map.set(fiber, parentScopeFiber);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const scopeFiber = map.get(fiber);

    scopeFiber && (typedFiber._debugScope = scopeFiber);
  }
};
