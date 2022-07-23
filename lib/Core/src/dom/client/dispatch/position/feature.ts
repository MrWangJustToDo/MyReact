import { append } from './append';
import { getInsertBeforeDomFromSiblingAndParent } from './getInsertBeforeDom';
import { insertBefore } from './insertBefore';

import type { MyReactFiberNode } from '../../../../fiber';

export const position = (
  fiber: MyReactFiberNode,
  parentFiberWithDom: MyReactFiberNode
) => {
  if (fiber.__pendingPosition__) {
    const parent = fiber.parent as MyReactFiberNode;
    const children = parent.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const childFiber = children[i];
      if (childFiber.__pendingPosition__) {
        const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(
          childFiber,
          parentFiberWithDom
        );
        if (beforeFiberWithDom) {
          insertBefore(
            childFiber,
            beforeFiberWithDom.dom as Element,
            parentFiberWithDom.dom as Element
          );
        } else {
          append(childFiber, parentFiberWithDom.dom as Element);
        }
        childFiber.__pendingPosition__ = false;
      }
    }
  }
};
