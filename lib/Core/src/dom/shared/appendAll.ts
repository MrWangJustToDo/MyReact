import type { MyReactFiberNode } from '../../fiber';

export const appendAll = (fiber: MyReactFiberNode, parentDOM: HTMLElement) => {
  fiber.__pendingAppend__ = false;
  if (fiber.dom) {
    parentDOM.appendChild(fiber.dom);
  }
  fiber.children.forEach((f) =>
    appendAll(f, (fiber.dom as HTMLElement) || parentDOM)
  );
};
