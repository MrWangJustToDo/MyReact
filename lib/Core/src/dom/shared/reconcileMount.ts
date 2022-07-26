import { globalDispatch, rootFiber } from '../../share';

import { getFiberWithDom } from './getFiberWithDom';

import type { MyReactFiberNode } from '../../fiber';

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  const parentDomFiber = (getFiberWithDom(fiber.parent, (f) => f.parent) ||
    rootFiber.current) as MyReactFiberNode;
  globalDispatch.current.reconcileCommit(fiber, hydrate, parentDomFiber);
};
