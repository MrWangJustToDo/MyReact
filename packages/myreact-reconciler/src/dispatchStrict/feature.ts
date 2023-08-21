import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";

export const defaultGenerateStrictMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, boolean>) => {
  const parent = fiber.parent;

  if (parent) {
    if (include(parent.type, NODE_TYPE.__strict__)) {
      map.set(fiber, true);
    } else {
      const parentIsStrict = map.get(parent);

      parentIsStrict && map.set(fiber, parentIsStrict);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const isStrict = map.get(fiber);

    isStrict && (typedFiber._debugStrict = true);
  }
};
