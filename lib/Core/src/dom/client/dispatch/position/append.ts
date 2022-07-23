import type { MyReactFiberNode } from '../../../../fiber';

export const append = (fiber: MyReactFiberNode, parentDOM: Element) => {
  if (!fiber) throw new Error('position error, look like a bug');
  fiber.__pendingAppend__ = false;
  fiber.__pendingPosition__ = false;
  if (fiber.__isPortal__) return;
  if (fiber.__isPlainNode__ || fiber.__isTextNode__) {
    parentDOM.appendChild(fiber.dom as Element);
    return;
  }
  fiber.children.forEach((f) => append(f, parentDOM));
};
