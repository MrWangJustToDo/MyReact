import type { MyReactFiberNode } from "@my-react/react";

export const getFiberWithDom = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | MyReactFiberNode[] | null = (f) => f.parent
): MyReactFiberNode | null => {
  if (!fiber) return null;
  if (fiber.__isPortal__) return null;
  if (fiber.dom) return fiber;
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
