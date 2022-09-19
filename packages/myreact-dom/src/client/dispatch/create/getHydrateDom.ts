import { __my_react_shared__, __my_react_internal__ } from "@my-react/react";

import { createDomNode, IS_SINGLE_ELEMENT } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export type HydrateDOM = Element & {
  __hydrate__: boolean;
};

const { NODE_TYPE } = __my_react_internal__;

const { log } = __my_react_shared__;

const getNextHydrateDom = (parentDom: Element) => {
  const children = Array.from(parentDom.childNodes);

  return children.find((dom) => dom.nodeType !== document.COMMENT_NODE && !(dom as HydrateDOM).__hydrate__);
};

const checkHydrateDom = (fiber: MyReactFiberNode, dom?: ChildNode) => {
  if (!dom) {
    log({
      fiber,
      level: "error",
      message: "hydrate error, dom not render from server",
    });
    return false;
  }
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: ${dom.nodeName.toLowerCase()}, client: ${fiber.element}`,
      });
      return false;
    }
    return true;
  }
  if (fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElement = fiber.element as MyReactElement;
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: ${dom.nodeName.toLowerCase()}, client: ${typedElement.type.toString()}`,
      });
      return false;
    }
    if (typedElement.type.toString() !== dom.nodeName.toLowerCase()) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: ${dom.nodeName.toLowerCase()}, client: ${typedElement.type.toString()}`,
      });
      return false;
    }
    return true;
  }
  throw new Error("hydrate error, look like a bug");
};

export const getHydrateDom = (fiber: MyReactFiberNode, parentDom: Element) => {
  if (IS_SINGLE_ELEMENT[parentDom.tagName.toLowerCase() as keyof typeof IS_SINGLE_ELEMENT]) return { result: true };

  const dom = getNextHydrateDom(parentDom);

  const result = checkHydrateDom(fiber, dom);

  if (result) {
    const typedDom = dom as HydrateDOM;

    fiber.node = createDomNode(typedDom);

    return { dom: typedDom, result };
  } else {
    return { dom, result };
  }
};
