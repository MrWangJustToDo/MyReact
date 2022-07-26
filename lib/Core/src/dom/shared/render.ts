import { mountLoopSync } from '../../core';
import { globalLoop, isAppMounted, safeCall } from '../../share';

import { reconcileMount } from './reconcileMount';

import type { MyReactFiberNode } from '../../fiber';

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  safeCall(() => mountLoopSync(fiber));

  reconcileMount(fiber, hydrate);

  isAppMounted.current = true;

  globalLoop.current = false;
};
