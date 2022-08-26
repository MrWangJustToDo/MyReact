import { IS_SINGLE_ELEMENT, log } from '../../../../share';

import type { Children } from '../../../../element';
import type { MyReactFiberNode } from '../../../../fiber';

export type HydrateDOM = Element & {
  __hydrate__: boolean;
};

const getNextHydrateDom = (parentDom: Element) => {
  const children = Array.from(parentDom.childNodes);

  return children.find(
    (dom) =>
      dom.nodeType !== document.COMMENT_NODE && !(dom as HydrateDOM).__hydrate__
  );
};

const checkHydrateDom = (fiber: MyReactFiberNode, dom?: ChildNode) => {
  if (!dom) {
    log({
      fiber,
      level: 'error',
      message: 'hydrate error, dom not render from server',
    });
    return false;
  }
  if (fiber.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      log({
        fiber,
        level: 'error',
        message: `hydrate error, dom not match from server. server: ${dom.nodeName.toLowerCase()}, client: ${
          fiber.element
        }`,
      });
      return false;
    }
    return true;
  }
  if (fiber.__isPlainNode__) {
    const typedElement = fiber.element as Children;
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      log({
        fiber,
        level: 'error',
        message: `hydrate error, dom not match from server. server: ${dom.nodeName.toLowerCase()}, client: ${typedElement.type.toString()}`,
      });
      return false;
    }
    if (typedElement.type.toString() !== dom.nodeName.toLowerCase()) {
      log({
        fiber,
        level: 'error',
        message: `hydrate error, dom not match from server. server: ${dom.nodeName.toLowerCase()}, client: ${typedElement.type.toString()}`,
      });
      return false;
    }
    return true;
  }
  throw new Error('hydrate error, look like a bug');
};

export const getHydrateDom = (fiber: MyReactFiberNode, parentDom: Element) => {
  if (
    IS_SINGLE_ELEMENT[
      parentDom.tagName.toLowerCase() as keyof typeof IS_SINGLE_ELEMENT
    ]
  )
    return { result: true };
  const dom = getNextHydrateDom(parentDom);
  const result = checkHydrateDom(fiber, dom);
  if (result) {
    const typedDom = dom as HydrateDOM;
    fiber.dom = typedDom;
    return { dom: typedDom, result };
  } else {
    return { dom, result };
  }
};
