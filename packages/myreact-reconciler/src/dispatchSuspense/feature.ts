import { __my_react_shared__ } from "@my-react/react";
import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MyReactElementNode} from "@my-react/react";

const { enableDebugFiled } = __my_react_shared__;

export const defaultGenerateSuspenseMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode>) => {
  const parent = fiber.parent;

  if (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      map.set(fiber, parent);
    } else {
      const parentFiber = map.get(parent);

      parentFiber && map.set(fiber, parentFiber);
    }
  }

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const parentFiber = map.get(fiber);

    parentFiber && (typedFiber._debugSuspense = parentFiber);
  }
};

export const defaultResolveSuspense = (fiber: MyReactFiberNode): MyReactElementNode => {
  let parent = fiber.parent;
  while (parent) {
    if (include(parent.type, NODE_TYPE.__suspense__)) {
      return parent.pendingProps?.["fallback"];
    }
    parent = parent.parent;
  }

  return null;
};
