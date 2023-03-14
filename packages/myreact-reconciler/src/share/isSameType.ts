import { isValidElement, __my_react_internal__ } from "@my-react/react";
import { TYPEKEY, Portal } from "@my-react/react-shared";

import { getElementTypeFromElement } from "./elementType";

import type { MyReactElement, MyReactElementNode, MyReactFiberNode } from "@my-react/react";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

export function checkIsSameType(p: MyReactFiberNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactElementNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactFiberNode | MyReactElementNode, element: MyReactElementNode) {
  if (p instanceof MyReactFiberNodeClass) {
    const { nodeType } = getElementTypeFromElement(element);
    if (p.type === nodeType) {
      if (isValidElement(element)) {
        const typedIncomingElement = element as MyReactElement;
        const typedExistElement = p.element as MyReactElement;
        if (typeof typedExistElement.type === "object") {
          // TODO, currently implement portal just like builtin object node
          if (typedExistElement.type[TYPEKEY] === Portal) return true;
        }
        return Object.is(typedIncomingElement.type, typedExistElement.type);
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    const existElementType = getElementTypeFromElement(p);
    const incomingElementType = getElementTypeFromElement(element);
    if (existElementType.nodeType === incomingElementType.nodeType) {
      if (isValidElement(element)) {
        const typedExistElement = p as MyReactElement;
        const typedIncomingElement = element as MyReactElement;
        if (typeof typedExistElement.type === "object") {
          if (typedExistElement.type[TYPEKEY] === Portal) return true;
        }
        return Object.is(typedIncomingElement.type, typedExistElement.type);
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
