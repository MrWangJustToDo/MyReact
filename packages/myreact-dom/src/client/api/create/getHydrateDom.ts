import { NODE_TYPE, getElementName } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { commentE, commentS, enableHydrateWarn, log } from "@my-react-dom-shared";

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
    if (enableHydrateWarn.current) {
      log(fiber, "error", `hydrate error, dom not render from server, client: "${getElementName(fiber)}"`);
    }
    return false;
  }
  if (include(fiber.type, NODE_TYPE.__text__)) {
    if (dom.nodeType !== Node.TEXT_NODE) {
      if (fiber.elementType === " " || fiber.elementType === "") {
        const textNode = document.createTextNode("");
        dom?.parentElement?.insertBefore(textNode, dom);
        return textNode;
      } else {
        if (enableHydrateWarn.current) {
          log(fiber, "error", `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`);
        }
        return false;
      }
    }
    return dom;
  }
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    if (dom.nodeType !== Node.ELEMENT_NODE) {
      if (enableHydrateWarn.current) {
        log(fiber, "error", `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`);
      }
      return false;
    }
    if (fiber.elementType.toString().toLowerCase() !== dom.nodeName.toLowerCase()) {
      if (enableHydrateWarn.current) {
        log(fiber, "error", `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`);
      }
      return false;
    }
    return dom;
  }
  if (include(fiber.type, NODE_TYPE.__comment__)) {
    if (dom.nodeType !== Node.COMMENT_NODE) {
      if (enableHydrateWarn.current) {
        log(fiber, "error", `hydrate error, dom not match from server. server: "<${dom.nodeName.toLowerCase()} />", client: "${getElementName(fiber)}"`);
      }
      return false;
    }
    return dom;
  }
  log(fiber, 'error', `hydrate error, unknown node type: ${fiber.type}`);
};

/**
 * @internal
 */
export const getHydrateDom = (fiber: MyReactFiberNode, parentDom: Element, previousDom?: ChildNode) => {
  const dom = getNextHydrateDom(parentDom, previousDom);

  const resultDom = checkHydrateDom(fiber, dom);

  if (resultDom) {
    fiber.nativeNode = resultDom;
  } else {
    fallback(dom);

    throw new Error(`[@my-react/react-dom] Hydration failed because the initial UI does not match what was rendered on the server.`);
  }

  return resultDom;
};
