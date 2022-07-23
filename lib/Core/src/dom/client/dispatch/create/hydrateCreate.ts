import { fallback } from './fallback';
import { getHydrateDom } from './getHydrateDom';

import type { MyReactFiberNode } from '../../../../fiber';

export const hydrateCreate = (
  fiber: MyReactFiberNode,
  parentFiberWithDom: MyReactFiberNode
): boolean => {
  if (fiber.__isTextNode__ || fiber.__isPlainNode__) {
    const { dom, result } = getHydrateDom(
      fiber,
      parentFiberWithDom.dom as Element
    );
    if (result) {
      return true;
    } else if (dom) {
      fallback(dom);
    }
    return false;
  }
  throw new Error('hydrate error, portal element can not hydrate');
};
