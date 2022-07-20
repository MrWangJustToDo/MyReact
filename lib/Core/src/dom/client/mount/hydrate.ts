import { createFiberNode } from '../../../fiber';
import {
  globalDispatch,
  isHydrateRender,
  rootContainer,
  rootFiber,
} from '../../../share';
import { startRender } from '../../shared';
import { ClientDispatch } from '../dispatch';

import type { MyReactFiberNode } from '../../../fiber';
import type { Children } from '../../../vdom';

export const hydrate = (
  element: Children,
  container: HTMLElement & { __fiber__: MyReactFiberNode }
) => {
  globalDispatch.current = new ClientDispatch();

  isHydrateRender.current = true;

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.dom = container;

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  container.setAttribute?.('hydrate', 'MyReact');

  container.__fiber__ = fiber;

  startRender(fiber, true);

  isHydrateRender.current = false;
};
