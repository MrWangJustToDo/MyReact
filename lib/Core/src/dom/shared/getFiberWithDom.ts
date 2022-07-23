import type { MyReactFiberNode } from '../../fiber';

export const getFiberWithDom = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | null
): MyReactFiberNode | null => {
  if (fiber) {
    if (fiber.dom) return fiber;
    return getFiberWithDom(transform(fiber), transform);
  }
  return null;
};
