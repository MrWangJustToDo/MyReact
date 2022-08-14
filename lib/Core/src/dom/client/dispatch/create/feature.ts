import { hydrateCreate } from './hydrateCreate';
import { nativeCreate } from './nativeCreate';
import { validDomNesting } from './validDomNesting';

import type { MyReactFiberNode } from '../../../../fiber';

export const create = (
  fiber: MyReactFiberNode,
  hydrate: boolean,
  parentFiberWithDom: MyReactFiberNode
): boolean => {
  if (fiber.__pendingCreate__) {
    let re = false;
    validDomNesting(fiber);
    if (hydrate) {
      const result = hydrateCreate(fiber, parentFiberWithDom);
      if (!result) {
        nativeCreate(fiber);
      }
      re = result;
    } else {
      nativeCreate(fiber);
    }
    fiber.__pendingCreate__ = false;
    return re;
  }
  return hydrate;
};
