import { domHydrate } from './domHydrate';
import { fallback } from './fallback';
import { getHydrateDom } from './getHydrateDom';

import type { FiberDispatch } from '../../../../dispatch';
import type { MyReactFiberNode } from '../../../../fiber';

type FiberDOM = HTMLElement & {
  __fiber__: MyReactFiberNode;
};

export const tryHydrate = (
  fiber: MyReactFiberNode,
  parentDom: HTMLElement,
  dispatch: FiberDispatch
) => {
  if ((fiber as any).__skipHydrate__) return;
  if (fiber.__isTextNode__ || fiber.__isPlainNode__) {
    const result = getHydrateDom(fiber, parentDom);
    if (!result) {
      // hydrate failed, fallback to mount
      const fallbackParentFiber = (parentDom as FiberDOM).__fiber__;
      Array.from(parentDom.childNodes).forEach((n) => n.remove());
      fallback(fallbackParentFiber);
    } else {
      domHydrate(fiber, result, dispatch);
    }
  }
  fiber.children.forEach((f) =>
    tryHydrate(f, (fiber.dom as FiberDOM) || parentDom, dispatch)
  );
};
