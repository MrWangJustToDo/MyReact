import { isHydrateRender, enableAllCheck } from '../../../../share';

import { hydrateCreate } from './hydrateCreate';
import { nativeCreate } from './nativeCreate';
import { validDomNesting } from './validDomNesting';

import type { MyReactFiberNode } from '../../../../fiber';
import type { HydrateDOM } from './getHydrateDom';

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
    if (isHydrateRender.current) {
      const typedDom = fiber.dom as HydrateDOM;
      typedDom.__hydrate__ = true;
      if (enableAllCheck.current && fiber.__isPlainNode__) {
        if (!re) {
          typedDom.setAttribute('debug_hydrate', 'fail');
        } else {
          typedDom.setAttribute('debug_hydrate', 'success');
        }
      }
    }
    fiber.__pendingCreate__ = false;
    return re;
  }
  return hydrate;
};
