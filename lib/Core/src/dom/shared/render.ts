import {
  renderLoopSync,
  runAppend,
  runCreate,
  runHydrate,
  runUpdate,
} from '../../core';
import { runEffect, runLayoutEffect } from '../../effect';
import { globalLoop, isAppMounted, safeCall } from '../../share';

import type { MyReactFiberNode } from '../../fiber';

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  safeCall(() => renderLoopSync(fiber));

  if (hydrate) {
    runHydrate();
  }

  runCreate();

  runUpdate();

  runAppend();

  runLayoutEffect();

  runEffect();

  isAppMounted.current = true;

  globalLoop.current = false;
};
