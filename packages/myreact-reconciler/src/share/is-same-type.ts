import { isValidElement, __my_react_shared__ } from "@my-react/react/type";
import { include } from "@my-react/react-shared";

import { MyReactFiberNode } from "../runtimeFiber";

import { getTypeFromElementNode } from "./element-type";
import { NODE_TYPE } from "./fiber-type";
import { getCurrentTypeFromRefresh } from "./refresh";

import type { MyReactElement, MyReactElementNode } from "@my-react/react/type";

const { enableHMRForDev } = __my_react_shared__;

export function checkIsSameType(p: MyReactFiberNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactElementNode, element: MyReactElementNode): boolean;
export function checkIsSameType(p: MyReactFiberNode | MyReactElementNode, element: MyReactElementNode) {
  if (p instanceof MyReactFiberNode) {
    const { nodeType, elementType } = getTypeFromElementNode(element);
    if (p.type === nodeType) {
      if (isValidElement(element)) {
        // React recreates a portal fiber when its container changes
        if (include(nodeType, NODE_TYPE.__portal__)) {
          return Object.is(p.pendingProps?.["container"], (element as MyReactElement).props?.["container"]);
        }
        if (__DEV__ && enableHMRForDev.current && include(nodeType, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
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
        // React recreates a portal fiber when its container changes
        if (include(existElementType.nodeType, NODE_TYPE.__portal__) && isValidElement(p)) {
          return Object.is(typedExistElement.props?.["container"], typedIncomingElement.props?.["container"]);
        }
        if (__DEV__ && enableHMRForDev.current && include(existElementType.nodeType, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
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
