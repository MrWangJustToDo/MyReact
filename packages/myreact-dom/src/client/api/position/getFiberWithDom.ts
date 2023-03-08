import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

export const getFiberWithDom = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | MyReactFiberNode[] | null = (f) => f.parent
): MyReactFiberNode | null => {
  if (!fiber) return null;

  if (fiber.isInvoked && !fiber.isMounted) return getFiberWithDom(transform(fiber) as MyReactFiberNode | null, transform);

  if (fiber.type & NODE_TYPE.__isPortal__) return null;

  if (fiber.type & (NODE_TYPE.__isPlainNode__ | NODE_TYPE.__isTextNode__ | NODE_TYPE.__isCommentNode__)) return fiber;

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
