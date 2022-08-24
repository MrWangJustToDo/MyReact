import { hydrateUpdate } from './hydrateUpdate';
import { nativeUpdate } from './nativeUpdate';

import type { MyReactFiberNode } from '../../../../fiber';

export const update = (fiber: MyReactFiberNode, hydrate: boolean) => {
  if (fiber.__pendingUpdate__) {
    if (hydrate) {
      hydrateUpdate(fiber);
    } else {
      nativeUpdate(fiber);
    }

    fiber.applyVDom();

    fiber.__pendingUpdate__ = false;
  }
};
