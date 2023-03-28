import type { MyReactFiberNode } from "../runtimeFiber";

export const debugWithNode = (fiber: MyReactFiberNode) => {
  if (fiber.nativeNode) {
    const node = fiber.nativeNode as any;
    node.__fiber__ = fiber;
    node.__props__ = fiber.pendingProps;
  }
};
