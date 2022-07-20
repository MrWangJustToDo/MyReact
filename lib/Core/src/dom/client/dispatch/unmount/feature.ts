import { unmountFiber } from '../../../../fiber';

import { clearFiberDom } from './clearFiberDom';

import type { MyReactFiberNode } from '../../../../fiber';

export const unmountFiberNode = (fiber: MyReactFiberNode) => {
  unmountFiber(fiber);
  clearFiberDom(fiber);
};
