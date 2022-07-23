import { PlainElement } from './plain';
import { TextElement } from './text';

import type { MyReactFiberNode } from '../../../fiber';
import type { Children } from '../../../vdom';

export const create = (fiber: MyReactFiberNode) => {
  if (fiber.__pendingCreate__) {
    if (fiber.__isTextNode__) {
      fiber.dom = new TextElement(fiber.element as string) as any;
    } else if (fiber.__isPlainNode__) {
      const typedElement = fiber.element as Children;
      fiber.dom = new PlainElement(typedElement.type as string) as any;
    } else {
      throw new Error('createPortal() can not call on the server');
    }
    fiber.__pendingCreate__ = false;
  }
};
