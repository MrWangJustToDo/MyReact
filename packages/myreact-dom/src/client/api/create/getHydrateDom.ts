import { NODE_TYPE, getElementName } from "@my-react/react-reconciler";

import { log } from "@my-react-dom-shared";

import { fallback } from "../fallback";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const isValidHydrateDom = (el: ChildNode) => {
  if (el.nodeType === Node.COMMENT_NODE) {
    if (el.textContent === " " || el.textContent === "") return false;
  }
  return true;
};

const getNextHydrateDom = (parentDom: Element, previousDom?: ChildNode) => {
  if (previousDom) {
    let el = previousDom.nextSibling;

    while (el && !isValidHydrateDom(el)) {
      el = el.nextSibling;
    }

    return el;
  } else {
    let el = parentDom.firstChild;

    while (el && !isValidHydrateDom(el)) {
      el = el.nextSibling;
    }

    return el;
  }
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
  if (fiber.type & NODE_TYPE.__text__) {
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
  if (fiber.type & NODE_TYPE.__plain__) {
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
      });
      return false;
    }
    if (fiber.elementType.toString() !== dom.nodeName.toLowerCase()) {
      log({
        fiber,
        level: "error",
        message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
      });
      return false;
    }
    return true;
  }
  if (fiber.type & NODE_TYPE.__comment__) {
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

export const getHydrateDom = (fiber: MyReactFiberNode, parentDom: Element, previousDom?: ChildNode) => {
  const dom = getNextHydrateDom(parentDom, previousDom);

  const result = checkHydrateDom(fiber, dom);

  if (result) {
    fiber.nativeNode = dom;
  } else {
    fallback(dom);
  }

  return result;
};
