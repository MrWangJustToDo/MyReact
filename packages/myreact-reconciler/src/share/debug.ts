import type { MyReactFiberContainer, MyReactFiberNode } from "../runtimeFiber";

export const debugWithNode = (fiber: MyReactFiberNode) => {
  const mayFiberContainer = fiber as MyReactFiberContainer;
  if (fiber.nativeNode || mayFiberContainer.containerNode) {
    const node = (fiber.nativeNode || mayFiberContainer.containerNode) as any;
    node.__fiber__ = fiber;
    node.__props__ = fiber.pendingProps;
  }
};
