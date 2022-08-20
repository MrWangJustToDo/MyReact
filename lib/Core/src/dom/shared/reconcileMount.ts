import { globalDispatch } from '../../share';

import type { MyReactFiberNode } from '../../fiber';

export const reconcileMount = (fiber: MyReactFiberNode, hydrate: boolean) => {
  globalDispatch.current.reconcileCommit(fiber, hydrate, fiber);
};
