import { unmountFiber } from '../../../../fiber';
import { mapFiber } from '../../../../share';

import { clearFiberDom } from './clearFiberDom';

import type { MyReactFiberNode } from '../../../../fiber';

export const _unmount = (fiber: MyReactFiberNode) => {
  unmountFiber(fiber);
  clearFiberDom(fiber);
};

export const unmount = (fiber: MyReactFiberNode) => {
  const allUnmountFiber = fiber.__unmountQueue__.slice(0);

  if (allUnmountFiber.length) {
    mapFiber(allUnmountFiber as MyReactFiberNode | MyReactFiberNode[], (f) =>
      _unmount(f)
    );
  }

  fiber.__unmountQueue__ = [];
};
