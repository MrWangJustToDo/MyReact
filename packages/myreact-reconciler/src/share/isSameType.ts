import { isValidElement, __my_react_shared__ } from "@my-react/react";

import { MyReactFiberNode } from "../runtimeFiber";

import { getTypeFromElementNode } from "./elementType";
import { NODE_TYPE } from "./fiberType";
import { getCurrentTypeFromRefresh } from "./refresh";

import type { MyReactElement, MyReactElementNode } from "@my-react/react";

const { enableHMRForDev } = __my_react_shared__;

export function checkIsSameType(p: MyReactFiberNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactElementNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactFiberNode | MyReactElementNode, element: MyReactElementNode) {
  if (p instanceof MyReactFiberNode) {
    const { nodeType, elementType } = getTypeFromElementNode(element);
    if (p.type === nodeType) {
      if (isValidElement(element)) {
        if (__DEV__ && enableHMRForDev.current && nodeType & (NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
          // type error
          return Object.is(getCurrentTypeFromRefresh((p as MyReactFiberNode).elementType), getCurrentTypeFromRefresh(elementType));
        } else {
          return Object.is(p.elementType, elementType);
        }
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
        if (__DEV__ && enableHMRForDev.current && existElementType.nodeType & (NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
          return Object.is(getCurrentTypeFromRefresh(typedIncomingElement.type), getCurrentTypeFromRefresh(typedExistElement.type));
        } else {
          return Object.is(typedIncomingElement.type, typedExistElement.type);
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
