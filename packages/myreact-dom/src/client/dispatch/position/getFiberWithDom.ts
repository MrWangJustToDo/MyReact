import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const getFiberWithDom = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | MyReactFiberNode[] | null = (f) => f.parent
): MyReactFiberNode | null => {
  if (!fiber) return null;

  if (fiber.type & NODE_TYPE.__isPortal__) return null;

  if (fiber.node) return fiber;

  const nextFibers = transform(fiber);

  if (Array.isArray(nextFibers)) {
    return nextFibers.reduce<MyReactFiberNode | null>((p, c) => {
      if (p) return p;

      p = getFiberWithDom(c, transform);

      return p;
    }, null);
  } else {
    return getFiberWithDom(nextFibers, transform);
  }
};
