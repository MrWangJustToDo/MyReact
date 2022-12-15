import { __my_react_shared__ } from "@my-react/react";
import { isCommentStartElement } from "@my-react/react-reconciler";
import { NODE_TYPE } from "@my-react/react-shared";

import { commentE, commentS, IS_SINGLE_ELEMENT, log } from "@my-react-dom-shared";

import type { ClientDispatch } from "../instance";
import type { DomComment } from "@my-react-dom-shared";
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
      if (dom.textContent === commentS || dom.textContent === commentE) return true;
    }
    return true;
  });
};

const getNextHydrateScope = (parentDom: Element) => {
  const children = Array.from(parentDom.childNodes);

  let start: DomComment | null = null;
  let index = 0;
  let end: DomComment | null = null;

  for (let i = 0; i < children.length; i++) {
    const typedDom = children[i] as HydrateDOM;
    if (!typedDom.__hydrate__) {
      if (typedDom.nodeType === Node.COMMENT_NODE) {
        if (typedDom.textContent === commentS) {
          start = start || (typedDom as unknown as DomComment);
          index++;
        }
        if (typedDom.textContent === commentE) {
          index--;
          if (index === 0) {
            end = typedDom as unknown as DomComment;
          }
        }
      } else {
        // there are some not match error, just break.
        if (!start) break;
      }
    }
    if (start && end) break;
  }

  return { start, end };
};

const generateHydrateScope = (fiber: MyReactFiberNode, scope: ReturnType<typeof getNextHydrateScope>) => {
  const globalDispatch = fiber.root.globalDispatch as ClientDispatch;

  const scopeId = globalDispatch.resolveScopeId(fiber);

  // TODO 如果scope不存在，回退到更上层的scope
  globalDispatch.hydrateScope[scopeId] = scope;
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
  if (fiber.type & NODE_TYPE.__isCommentNode__) {
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

  if (isCommentStartElement(fiber)) {
    const scope = getNextHydrateScope(parentDom);

    generateHydrateScope(fiber, scope);

    const dom = scope.start;

    if (dom) {
      fiber.node = dom;

      return { dom, result: true };
    } else {
      return { dom, result: false };
    }
  } else {
    const dom = getNextHydrateDom(parentDom);

    const result = checkHydrateDom(fiber, dom);

    if (result) {
      const typedDom = dom as HydrateDOM;

      fiber.node = typedDom;

      return { dom: typedDom, result };
    } else {
      return { dom, result };
    }
  }
};
