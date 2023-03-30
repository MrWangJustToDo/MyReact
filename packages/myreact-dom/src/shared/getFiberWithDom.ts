import type { MyReactFiberNode } from "@my-react/react-reconciler";

export const getFiberWithNativeDom = (fiber: MyReactFiberNode | null, transform: (f: MyReactFiberNode) => MyReactFiberNode | null): MyReactFiberNode | null => {
  if (fiber) {
    if (fiber.nativeNode && fiber.isMounted) return fiber;
    return getFiberWithNativeDom(transform(fiber), transform);
  }
  return null;
};
