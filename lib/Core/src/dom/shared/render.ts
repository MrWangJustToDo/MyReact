import { renderLoopSync } from '../../core';
import { globalLoop, isAppMounted, safeCall } from '../../share';

import { reconcile } from './reconcile';

import type { MyReactFiberNode } from '../../fiber';

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  safeCall(() => renderLoopSync(fiber));

  reconcile(fiber, hydrate);

  isAppMounted.current = true;

  globalLoop.current = false;
};
