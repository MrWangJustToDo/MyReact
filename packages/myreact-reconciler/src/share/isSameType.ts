import { isValidElement } from "@my-react/react";

import { MyReactFiberNode } from "../runtimeFiber";

import { getTypeFromElementNode } from "./elementType";

import type { MyReactElement, MyReactElementNode } from "@my-react/react";

export function checkIsSameType(p: MyReactFiberNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactElementNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactFiberNode | MyReactElementNode, element: MyReactElementNode) {
  if (p instanceof MyReactFiberNode) {
    const { nodeType } = getTypeFromElementNode(element);
    if (p.type === nodeType) {
      if (isValidElement(element)) {
        const typedIncomingElement = element as MyReactElement;
        const typedExistElement = p.element as MyReactElement;
        return Object.is(typedIncomingElement.type, typedExistElement.type);
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    const existElementType = getTypeFromElementNode(p);
    const incomingElementType = getTypeFromElementNode(element);
    if (existElementType.nodeType === incomingElementType.nodeType) {
      if (isValidElement(element)) {
        const typedExistElement = p as MyReactElement;
        const typedIncomingElement = element as MyReactElement;
        return Object.is(typedIncomingElement.type, typedExistElement.type);
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
