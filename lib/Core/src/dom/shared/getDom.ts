import type { MyReactFiberNode } from '../../fiber';

export const getDom = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | null
): HTMLElement | Text | null => {
  if (fiber) {
    if (fiber.dom) return fiber.dom;
    return getDom(transform(fiber), transform);
  }
  return null;
};
