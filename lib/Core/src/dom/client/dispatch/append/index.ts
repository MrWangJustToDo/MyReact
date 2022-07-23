import { IS_SINGLE_ELEMENT } from '../../../../share';

import type { MyReactFiberNode } from '../../../../fiber';

export const append = (fiber: MyReactFiberNode, parentDom: Element) => {
  if (fiber.__pendingAppend__) {
    if (!fiber.dom) throw new Error('append error, dom not exist');
    if (
      !Object.prototype.hasOwnProperty.call(
        IS_SINGLE_ELEMENT,
        parentDom.tagName.toLowerCase()
      )
    ) {
      parentDom.appendChild(fiber.dom);
    }
    fiber.__pendingAppend__ = false;
  }
};
