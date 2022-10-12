import { isValidElement, Portal, __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import type { MyReactElement, MyReactElementNode, MyReactFiberNode } from "@my-react/react";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;
const { getTypeFromElement } = __my_react_shared__;

export function checkIsSameType(p: MyReactFiberNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactElementNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactFiberNode | MyReactElementNode, element: MyReactElementNode) {
  if (p instanceof MyReactFiberNodeClass) {
    const elementType = getTypeFromElement(element);
    if (p.type === elementType) {
      if (isValidElement(element)) {
        const typedIncomingElement = element as MyReactElement;
        const typedExistElement = p.element as MyReactElement;
        // todo check for object element
        if (typeof typedExistElement.type === "object") {
          if (typedExistElement.type.$$typeof === Portal) return true;
        }
        return Object.is(typedIncomingElement.type, typedExistElement.type);
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    const existElementType = getTypeFromElement(p);
    const incomingElementType = getTypeFromElement(element);
    if (existElementType === incomingElementType) {
      if (isValidElement(element)) {
        const typedExistElement = p as MyReactElement;
        const typedIncomingElement = element as MyReactElement;
        if (typeof typedExistElement.type === "object") {
          if (typedExistElement.type.$$typeof === Portal) return true;
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
