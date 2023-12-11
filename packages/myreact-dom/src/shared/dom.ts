import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include } from "@my-react/react-shared";

import { PlainElement } from "@my-react-dom-server/api";

/**
 * @internal
 */
export type DomElement = Element;

/**
 * @internal
 */
export type DomNode = Node;

/**
 * @internal
 */
export type DomComment = Comment;

/**
 * @internal
 */
const checkParentDomIsSVG = (fiber: MyReactFiberNode): boolean => {
  let parent = fiber.parent;
  while (parent && !parent.nativeNode) {
    parent = parent.parent;
  }
  if (parent.nativeNode) {
    if (parent.nativeNode instanceof PlainElement) {
      return parent.nativeNode.isSVG;
    } else {
      return parent.nativeNode instanceof SVGElement;
    }
  }
  return false;
};

/**
 * @internal
 */
export const checkCurrentIsSVG = (fiber: MyReactFiberNode): boolean => {
  if (include(fiber.type, NODE_TYPE.__plain__)) {
    if (fiber.elementType === 'svg') return true;

    const parentElement = fiber.nativeNode?.parentElement;

    if (parentElement) {
      if (parentElement instanceof PlainElement) {
        return parentElement.isSVG;
      } else {
        return parentElement instanceof SVGElement;
      }
    }
    
    return checkParentDomIsSVG(fiber);
  }
  return false;
};
