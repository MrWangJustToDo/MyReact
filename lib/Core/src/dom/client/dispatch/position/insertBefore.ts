import type { MyReactFiberNode } from '../../../../fiber';

export const insertBefore = (
  fiber: MyReactFiberNode,
  beforeDOM: Element,
  parentDOM: Element
) => {
  if (!fiber) throw new Error('position error, look like a bug');
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    parentDOM.insertBefore(fiber.dom as Element, beforeDOM);
    return;
  }
  fiber.children.forEach((f) => insertBefore(f, beforeDOM, parentDOM));
};
