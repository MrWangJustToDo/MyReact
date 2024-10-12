import { __my_react_shared__ } from "@my-react/react";
import { include, STATE_TYPE } from "@my-react/react-shared";

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

      if (parentScopeFiber) {
        if (parentScopeFiber.state * STATE_TYPE.__unmount__) {
          map.delete(parent);

          map.delete(fiber);
        } else {
          map.set(fiber, parentScopeFiber);
        }
      }
    }
  }

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const scopeFiber = map.get(fiber);

    if (scopeFiber) {
      typedFiber._debugScope = scopeFiber;
    } else {
      typedFiber._debugScope = null;
    }
  }
};

export const defaultResolveScope = (fiber: MyReactFiberNode) => {
  let parent = fiber.parent;

  while (parent) {
    if (include(parent.type, NODE_TYPE.__scope__)) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
};
