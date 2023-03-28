import { STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const getFiberWithNativeDom = (fiber: MyReactFiberNode | null, transform: (f: MyReactFiberNode) => MyReactFiberNode | null): MyReactFiberNode | null => {
  if (fiber) {
    if (fiber.nativeNode && !(fiber.state & STATE_TYPE.__unmount__)) return fiber;
    return getFiberWithNativeDom(transform(fiber), transform);
  }
  return null;
};
