import { __my_react_shared__ } from "@my-react/react";
import { NODE_TYPE } from "@my-react/react-shared";

import { IS_SINGLE_ELEMENT, log } from "@my-react-dom-shared";

import type { MyReactElement, MyReactFiberNode } from "@my-react/react";

export type HydrateDOM = Element & {
  __hydrate__: boolean;
};

const { getElementName } = __my_react_shared__;

const getNextHydrateDom = (parentDom: Element) => {
  const children = Array.from(parentDom.childNodes);

  return children.find((dom) => {
    const typedDom = dom as HydrateDOM;

    // skip hydrated
    if (typedDom.__hydrate__) return false;

    if (dom.nodeType === Node.COMMENT_NODE) {
      // skip empty comment
      if (dom.textContent === " " || dom.textContent === "") return false;
      // scope comment
      if (dom.textContent === " [ " || dom.textContent === " ] ") return true;
    }
    return true;
  });
};

const checkHydrateDom = (fiber: MyReactFiberNode, dom?: ChildNode) => {
  if (!dom) {
    log({
      fiber,
      level: "error",
      message: `hydrate error, dom not render from server, client: "${getElementName(fiber)}"`,
    });
    return false;
  }
  if (fiber.type & NODE_TYPE.__isTextNode__) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
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
        message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
      });
      return false;
    }
    if (typedElement.type.toString() !== dom.nodeName.toLowerCase()) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
      });
      return false;
    }
    return true;
  }
  if (fiber.type & (NODE_TYPE.__isCommentStartNode__ | NODE_TYPE.__isCommentEndNode__)) {
    if (dom.nodeType !== Node.COMMENT_NODE) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
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

    fiber.node = typedDom;

    return { dom: typedDom, result };
  } else {
    return { dom, result };
  }
};
