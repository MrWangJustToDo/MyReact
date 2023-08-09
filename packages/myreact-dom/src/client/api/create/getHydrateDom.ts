import { NODE_TYPE, getElementName } from "@my-react/react-reconciler";

import { commentE, commentS, log } from "@my-react-dom-shared";

import { fallback } from "../fallback";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const isValidHydrateDom = (el: ChildNode) => {
  if (el.nodeType === Node.COMMENT_NODE) {
    if (el.textContent === commentS || el.textContent === commentE) return true;
    return false;
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
      if (fiber.elementType === " " || fiber.elementType === "") {
        const textNode = document.createTextNode("");
        dom?.parentElement?.insertBefore(textNode, dom);
        return textNode;
      } else {
        log({
          fiber,
          level: "error",
          message: `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`,
        });
        return false;
      }
    }
    return dom;
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
    return dom;
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
    return dom;
  }
  throw new Error("hydrate error, look like a bug");
};

export const getHydrateDom = (fiber: MyReactFiberNode, parentDom: Element, previousDom?: ChildNode) => {
  const dom = getNextHydrateDom(parentDom, previousDom);

  const resultDom = checkHydrateDom(fiber, dom);

  if (resultDom) {
    fiber.nativeNode = resultDom;
  } else {
    fallback(dom);
  }

  return resultDom;
};
