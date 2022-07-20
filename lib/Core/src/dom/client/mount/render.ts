import { createFiberNode, MyReactFiberNode } from '../../../fiber';
import { globalDispatch, rootContainer, rootFiber } from '../../../share';
import { startRender, unmountComponentAtNode } from '../../shared';
import { ClientDispatch } from '../dispatch';

import type { Children } from '../../../vdom';

export const render = (
  element: Children,
  container: HTMLElement & { __fiber__: MyReactFiberNode }
) => {
  globalDispatch.current = new ClientDispatch();

  const containerFiber = container.__fiber__;
  if (containerFiber instanceof MyReactFiberNode) {
    if (containerFiber.checkIsSameType(element)) {
      containerFiber.installVDom(element);
      containerFiber.update();
      return;
    } else {
      unmountComponentAtNode(container);
    }
  }
  Array.from(container.children).forEach((n) => n.remove?.());

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.dom = container;

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  container.setAttribute?.('render', 'MyReact');

  container.__fiber__ = fiber;

  startRender(fiber);
};
