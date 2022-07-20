import { globalDispatch, rootFiber } from '../share';

import type { MyReactFiberNode } from '../fiber';

export const runHydrate = () => {
  const hydrateFiber = rootFiber.current as MyReactFiberNode;
  globalDispatch.current.hydrate(hydrateFiber);
};
