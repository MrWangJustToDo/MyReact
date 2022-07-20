import { safeCall } from '../share';

import { nextWorkAsync } from './donext';
import { transformAll, transformStart } from './transform';

import type { MyReactFiberNode } from '../fiber';

export const renderLoopSync = (fiber: MyReactFiberNode) => {
  transformStart(fiber);
  transformAll();
};

export const renderLoopAsync = (
  control: {
    get: () => MyReactFiberNode | null;
    set: (f: MyReactFiberNode) => void;
    has: () => boolean;
    yield: () => boolean;
  },
  shouldYield: () => boolean,
  cb: () => void,
  final: () => void
) => {
  while (control.has() && !shouldYield()) {
    const fiber = control.get();
    if (fiber) {
      const nextFiber = safeCall(() => nextWorkAsync(fiber));
      if (nextFiber) control.set(nextFiber);
    }
  }
  cb();
  final();
};
