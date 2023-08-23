import { __my_react_shared__ } from "@my-react/react";
import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";

const { enableDebugFiled } = __my_react_shared__;

// TODO used for hydrate fallback
export const defaultGenerateScopeMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode>) => {
  const parent = fiber.parent;

  if (parent) {
    if (include(parent.type, NODE_TYPE.__scope__)) {
      map.set(fiber, parent);
    } else {
      const parentScopeFiber = map.get(parent);

      parentScopeFiber && map.set(fiber, parentScopeFiber);
    }
  }

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const scopeFiber = map.get(fiber);

    scopeFiber && (typedFiber._debugScope = scopeFiber);
  }
};
