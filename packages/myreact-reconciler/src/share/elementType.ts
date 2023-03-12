import { isValidElement, __my_react_internal__ } from "@my-react/react";
import {
  Consumer,
  ForwardRef,
  Fragment,
  KeepLive,
  Lazy,
  Memo,
  Portal,
  Provider,
  Reactive,
  Scope,
  Strict,
  Suspense,
  Comment,
  TYPEKEY,
} from "@my-react/react-shared";

import { NODE_TYPE } from "./fiberType";

import type { MyReactElementNode, MyReactObjectComponent } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

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
