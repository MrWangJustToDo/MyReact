// for invalid dom structure

import { enableAllCheck, log } from '../../../../share';

import type { Children } from '../../../../element';
import type { MyReactFiberNode } from '../../../../fiber';

// TODO
export const validDomNesting = (fiber: MyReactFiberNode) => {
  if (!enableAllCheck.current) return;
  if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as Children;
    if (typedElement.type === 'p') {
      let parent = fiber.parent;
      while (parent && parent.__isPlainNode__) {
        const typedParentElement = parent.element as Children;
        if (typedParentElement.type === 'p') {
          log({
            fiber,
            level: 'warn',
            triggerOnce: true,
            message: `invalid dom nesting: <p> cannot appear as a child of <p>`,
          });
        }
        parent = parent.parent;
      }
    }
  }
};
