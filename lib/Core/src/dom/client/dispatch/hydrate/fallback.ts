import type { MyReactFiberNode } from '../../../../fiber';

export const fallback = (fiber: MyReactFiberNode) => {
  const children = fiber.children;
  children.forEach((c) => {
    c.dom = null;
    c.__pendingCreate__ = true;
    c.__pendingUpdate__ = true;
    c.__pendingAppend__ = true;
    (c as any).__skipHydrate__ = true;
    fallback(c);
  });
};
