import {
  once,
  NODE_TYPE,
  TYPEKEY,
  ForwardRef,
  Consumer,
  Provider,
  Fragment,
  Element,
  Comment,
  KeepLive,
  Reactive,
  Suspense,
  Strict,
  Portal,
  Scope,
  Lazy,
  Memo,
} from "@my-react/react-shared";

import { currentRunningFiber } from "../share";

import type {
  MaybeArrayMyReactElementNode,
  MyReactElement,
  MyReactElementNode,
  ArrayMyReactElementNode,
  ArrayMyReactElementChildren,
  MyReactObjectComponent,
} from "./instance";

export function isValidElement(element?: MyReactElementNode | any): element is MyReactElement {
  return typeof element === "object" && !Array.isArray(element) && element?.[TYPEKEY] === Element;
}

export function getTypeFromElement(element: MyReactElementNode) {
  let nodeTypeSymbol = NODE_TYPE.__initial__;
  if (isValidElement(element)) {
    const rawType = element.type;
    // object node
    if (typeof rawType === "object") {
      const typedRawType = rawType as MyReactObjectComponent;
      switch (typedRawType[TYPEKEY]) {
        case Provider:
          nodeTypeSymbol |= NODE_TYPE.__isContextProvider__;
          break;
        case Consumer:
          nodeTypeSymbol |= NODE_TYPE.__isContextConsumer__;
          break;
        case Portal:
          nodeTypeSymbol |= NODE_TYPE.__isPortal__;
          break;
        case Memo:
          nodeTypeSymbol |= NODE_TYPE.__isMemo__;
          break;
        case ForwardRef:
          nodeTypeSymbol |= NODE_TYPE.__isForwardRef__;
          break;
        case Lazy:
          nodeTypeSymbol |= NODE_TYPE.__isLazy__;
          break;
        case Reactive:
          nodeTypeSymbol |= NODE_TYPE.__isReactive__;
          break;
        default:
          throw new Error(`invalid object element type ${typedRawType[TYPEKEY]?.toString()}`);
      }
    } else if (typeof rawType === "function") {
      if (rawType.prototype?.isMyReactComponent) {
        nodeTypeSymbol |= NODE_TYPE.__isClassComponent__;
      } else {
        nodeTypeSymbol |= NODE_TYPE.__isFunctionComponent__;
      }
    } else if (typeof rawType === "symbol") {
      switch (rawType) {
        case KeepLive:
          nodeTypeSymbol |= NODE_TYPE.__isKeepLiveNode__;
          break;
        case Fragment:
          nodeTypeSymbol |= NODE_TYPE.__isFragmentNode__;
          break;
        case Strict:
          nodeTypeSymbol |= NODE_TYPE.__isStrictNode__;
          break;
        case Suspense:
          nodeTypeSymbol |= NODE_TYPE.__isSuspenseNode__;
          break;
        case Scope:
          nodeTypeSymbol |= NODE_TYPE.__isScopeNode__;
          break;
        case Comment:
          nodeTypeSymbol |= NODE_TYPE.__isCommentNode__;
          break;
        default:
          throw new Error(`invalid symbol element type ${rawType?.toString()}`);
      }
    } else if (typeof rawType === "string") {
      nodeTypeSymbol |= NODE_TYPE.__isPlainNode__;
    } else {
      if (__DEV__) {
        const fiber = currentRunningFiber.current;
        fiber?.root.renderPlatform.log({ message: `invalid element type ${String(rawType)}`, level: "warn", triggerOnce: true });
      }
      nodeTypeSymbol |= NODE_TYPE.__isEmptyNode__;
    }
  } else {
    if (typeof element === "object" && element !== null) {
      if (__DEV__) {
        const fiber = currentRunningFiber.current;
        fiber?.root.renderPlatform.log({ message: `invalid object element type ${JSON.stringify(element)}`, level: "warn", triggerOnce: true });
      }
      nodeTypeSymbol |= NODE_TYPE.__isEmptyNode__;
    } else if (element === null || element === undefined || typeof element === "boolean") {
      nodeTypeSymbol |= NODE_TYPE.__isNullNode__;
    } else {
      nodeTypeSymbol |= NODE_TYPE.__isTextNode__;
    }
  }

  return nodeTypeSymbol;
}

export const checkValidKey = (children: ArrayMyReactElementNode) => {
  const obj: Record<string, boolean> = {};
  const fiber = currentRunningFiber.current;
  const onceWarnDuplicate = once(fiber?.root.renderPlatform.log);
  const onceWarnUndefined = once(fiber?.root.renderPlatform.log);
  const validElement = children.filter((c) => isValidElement(c)) as MyReactElement[];
  if (validElement.length > 1) {
    validElement.forEach((c) => {
      if (!c._store["validKey"]) {
        if (typeof c.key === "string") {
          if (obj[c.key]) {
            onceWarnDuplicate({ message: `array child have duplicate key` });
          }
          obj[c.key] = true;
        } else {
          onceWarnUndefined({
            message: "each array child must have a unique key props",
            triggerOnce: true,
          });
        }
        c._store["validKey"] = true;
      }
    });
  }
};

export const checkArrayChildrenKey = (children: ArrayMyReactElementChildren) => {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      checkValidKey(child);
    } else {
      if (isValidElement(child)) child._store["validKey"] = true;
    }
  });
};

export const checkSingleChildrenKey = (children: MaybeArrayMyReactElementNode) => {
  if (Array.isArray(children)) {
    checkValidKey(children);
  } else {
    if (isValidElement(children)) children._store["validKey"] = true;
  }
};
