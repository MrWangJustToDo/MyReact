import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

export const mapFiber = (arrayLike: MyReactFiberNode | MyReactFiberNode[], action: (f: MyReactFiberNode) => void) => {
  if (Array.isArray(arrayLike)) {
    arrayLike.forEach((f) => mapFiber(f, action));
  } else {
    if (arrayLike instanceof MyReactFiberNodeClass) {
      action(arrayLike);
    }
  }
};
