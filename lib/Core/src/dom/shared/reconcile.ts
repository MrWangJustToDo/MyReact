import { globalDispatch, rootFiber } from '../../share';

import { getFiberWithDom } from './getFiberWithDom';

import type { MyReactFiberNode } from '../../fiber';

export const reconcile = (fiber: MyReactFiberNode, hydrate: boolean) => {
  if (fiber.__needReconcile__) {
    const parentDomFiber = (getFiberWithDom(fiber.parent, (f) => f.parent) ||
      rootFiber.current) as MyReactFiberNode;
    globalDispatch.current.reconcileCreate(fiber, hydrate, parentDomFiber);
    globalDispatch.current.reconcileCommit(fiber, hydrate, parentDomFiber);
  }
};
