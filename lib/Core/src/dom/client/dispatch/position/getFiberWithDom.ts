import type { MyReactFiberNode } from '../../../../fiber';

export const getFiberWithDom = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | null = (f) => f.parent
): MyReactFiberNode | null => {
  if (!fiber) return null;
  if (fiber.__isPortal__) return null;
  if (fiber.dom) return fiber;
  return getFiberWithDom(transform(fiber), transform);
};
