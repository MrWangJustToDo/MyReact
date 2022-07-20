import { createFiberNode } from '../../../fiber';
import {
  globalDispatch,
  isServerRender,
  rootContainer,
  rootFiber,
} from '../../../share';
import { startRender } from '../../shared';
import { ServerDispatch } from '../dispatch';
import { PlainElement } from '../dom';

import type { Children } from '../../../vdom';

// TODO should create global scope for every render
export const renderToString = (element: Children) => {
  globalDispatch.current = new ServerDispatch();

  isServerRender.current = true;

  const container = new PlainElement('');

  const fiber = createFiberNode({ fiberIndex: 0, parent: null }, element);

  fiber.__root__ = true;

  rootFiber.current = fiber;

  rootContainer.current = container;

  startRender(fiber);

  isServerRender.current = false;

  return container.toString();
};
