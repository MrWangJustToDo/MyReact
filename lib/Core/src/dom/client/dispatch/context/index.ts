import type { MyReactFiberNode } from '../../../../fiber';

export const context = (fiber: MyReactFiberNode) => {
  if (fiber.__pendingContext__) {
    const allListeners = fiber.__dependence__.slice(0);
    Promise.resolve().then(() => {
      allListeners
        .map((f) => f.__fiber__)
        .forEach((f) => f?.mount && f.update());
    });
    fiber.__pendingContext__ = false;
  }
};
