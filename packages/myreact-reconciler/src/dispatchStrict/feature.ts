import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";

export const defaultGenerateStrictMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, boolean>) => {
  const parent = fiber.parent;

  if (parent) {
    if (parent.type & NODE_TYPE.__strict__) {
      map.set(fiber, true);
    } else {
      map.set(fiber, map.get(parent) || false);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugStrict = map.get(fiber) || false;
  }
};
