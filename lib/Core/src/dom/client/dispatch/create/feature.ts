import { hydrateCreate } from './hydrateCreate';
import { nativeCreate } from './nativeCreate';

import type { MyReactFiberNode } from '../../../../fiber';

export const create = (
  fiber: MyReactFiberNode,
  hydrate: boolean,
  parentFiberWithDom: MyReactFiberNode
): boolean => {
  if (fiber.__pendingCreate__) {
    fiber.__pendingCreate__ = false;
    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithDom);
      if (result) {
        return true;
      } else {
        nativeCreate(fiber);
        return false;
      }
    } else {
      nativeCreate(fiber);
      return false;
    }
  }
  return hydrate;
};
