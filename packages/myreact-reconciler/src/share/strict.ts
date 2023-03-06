import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNodeDev } from "../fiber";
import type { MyReactFiberNode } from "@my-react/react";

export const defaultGenerateStrictMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, boolean>) => {
  const parent = fiber.parent;

  if (parent) {
    if (parent.type & NODE_TYPE.__isStrictNode__) {
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
