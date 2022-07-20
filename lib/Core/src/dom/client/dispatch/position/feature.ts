import { append } from './append';
import { getFiberWithDom } from './getFiberWithDom';
import { getInsertBeforeDomFromSiblingAndParent } from './getInsertBeforeDom';
import { insertBefore } from './insertBefore';

import type { MyReactFiberNode } from '../../../../fiber';

export const position = (fiber: MyReactFiberNode) => {
  const parent = fiber.parent as MyReactFiberNode;
  const children = parent.children;
  if (children.some((child) => child.__pendingPosition__)) {
    const parentDomFiber = getFiberWithDom(parent);
    if (!parentDomFiber) throw new Error('position error, look like a bug');
    for (let i = children.length - 1; i >= 0; i--) {
      const childFiber = children[i];
      if (childFiber.__pendingPosition__) {
        const beforeDomFiber = getInsertBeforeDomFromSiblingAndParent(
          childFiber,
          parentDomFiber
        );
        if (beforeDomFiber) {
          insertBefore(
            childFiber,
            beforeDomFiber.dom as HTMLElement,
            parentDomFiber.dom as HTMLElement
          );
        } else {
          append(childFiber, parentDomFiber.dom as HTMLElement);
        }
        childFiber.__pendingPosition__ = false;
      }
    }
  }
};
