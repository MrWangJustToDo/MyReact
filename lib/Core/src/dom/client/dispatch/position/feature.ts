import { append } from './append';
import { getInsertBeforeDomFromSiblingAndParent } from './getInsertBeforeDom';
import { insertBefore } from './insertBefore';

import type { MyReactFiberNode } from '../../../../fiber';

export const position = (
  fiber: MyReactFiberNode,
  parentFiberWithDom: MyReactFiberNode
) => {
  if (fiber.__pendingPosition__) {
    const beforeFiberWithDom = getInsertBeforeDomFromSiblingAndParent(
      fiber,
      parentFiberWithDom
    );
    if (beforeFiberWithDom) {
      insertBefore(
        fiber,
        beforeFiberWithDom.dom as Element,
        parentFiberWithDom.dom as Element
      );
    } else {
      append(fiber, parentFiberWithDom.dom as Element);
    }
    fiber.__pendingPosition__ = false;
  }
};
