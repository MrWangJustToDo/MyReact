import { hydrateCreate } from './hydrateCreate';
import { nativeCreate } from './nativeCreate';

import type { MyReactFiberNode } from '../../../../fiber';

export const create = (
  fiber: MyReactFiberNode,
  hydrate: boolean,
  parentFiberWithDom: MyReactFiberNode
): boolean => {
  if (fiber.__pendingCreate__) {
    let re = false;
    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithDom);
      if (!result) {
        nativeCreate(fiber);
      }
      re = result;
    } else {
      nativeCreate(fiber);
    }
    fiber.applyRef();
    fiber.__pendingCreate__ = false;
    return re;
  }
  return hydrate;
};
