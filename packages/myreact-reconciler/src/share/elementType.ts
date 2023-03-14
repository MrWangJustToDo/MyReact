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

import type { MyReactElementNode, MyReactObjectComponent, forwardRef, memo } from "@my-react/react";

const { currentRunningFiber } = __my_react_internal__;

export function getElementTypeFromElement(element: MyReactElementNode) {
  let nodeType = NODE_TYPE.__initial__;
  let elementType = undefined;
  if (isValidElement(element)) {
    const rawType = element.type;
    elementType = rawType;
    if (typeof rawType === "object") {
      const typedRawType = rawType as MyReactObjectComponent;
      switch (typedRawType[TYPEKEY]) {
        case Provider:
          nodeType |= NODE_TYPE.__isContextProvider__;
          break;
        case Consumer:
          nodeType |= NODE_TYPE.__isContextConsumer__;
          break;
        case Portal:
          nodeType |= NODE_TYPE.__isPortal__;
          break;
        case Memo:
          nodeType |= NODE_TYPE.__isMemo__;
          elementType = (typedRawType as ReturnType<typeof memo>).render;
          break;
        case ForwardRef:
          nodeType |= NODE_TYPE.__isForwardRef__;
          elementType = (typedRawType as ReturnType<typeof forwardRef>).render;
          break;
        case Lazy:
          nodeType |= NODE_TYPE.__isLazy__;
          break;
        case Reactive:
          nodeType |= NODE_TYPE.__isReactive__;
          break;
        default:
          throw new Error(`invalid object element type ${typedRawType[TYPEKEY]?.toString()}`);
      }
      if (typeof elementType === "object") {
        if (elementType[TYPEKEY] === ForwardRef) {
          nodeType |= NODE_TYPE.__isForwardRef__;
          elementType = (elementType as ReturnType<typeof forwardRef>).render;
        } else if (elementType[TYPEKEY] === Reactive) {
          nodeType |= NODE_TYPE.__isReactive__;
        }
      }
      if (typeof elementType === "function") {
        if (elementType.prototype?.isMyReactComponent) {
          nodeType |= NODE_TYPE.__isClassComponent__;
        } else {
          nodeType |= NODE_TYPE.__isFunctionComponent__;
        }
      }
    } else if (typeof rawType === "function") {
      if (rawType.prototype?.isMyReactComponent) {
        nodeType |= NODE_TYPE.__isClassComponent__;
      } else {
        nodeType |= NODE_TYPE.__isFunctionComponent__;
      }
    } else if (typeof rawType === "symbol") {
      switch (rawType) {
        case KeepLive:
          nodeType |= NODE_TYPE.__isKeepLiveNode__;
          break;
        case Fragment:
          nodeType |= NODE_TYPE.__isFragmentNode__;
          break;
        case Strict:
          nodeType |= NODE_TYPE.__isStrictNode__;
          break;
        case Suspense:
          nodeType |= NODE_TYPE.__isSuspenseNode__;
          break;
        case Scope:
          nodeType |= NODE_TYPE.__isScopeNode__;
          break;
        case Comment:
          nodeType |= NODE_TYPE.__isCommentNode__;
          break;
        default:
          throw new Error(`invalid symbol element type ${rawType?.toString()}`);
      }
    } else if (typeof rawType === "string") {
      nodeType |= NODE_TYPE.__isPlainNode__;
    } else {
      if (__DEV__) {
        const fiber = currentRunningFiber.current;
        fiber?.root.renderPlatform.log({ message: `invalid element type ${String(rawType)}`, level: "warn", triggerOnce: true });
      }
      nodeType |= NODE_TYPE.__isEmptyNode__;
    }
  } else {
    if (typeof element === "object" && element !== null) {
      if (__DEV__) {
        const fiber = currentRunningFiber.current;
        fiber?.root.renderPlatform.log({ message: `invalid object element type ${JSON.stringify(element)}`, level: "warn", triggerOnce: true });
      }
      nodeType |= NODE_TYPE.__isEmptyNode__;
    } else if (element === null || element === undefined || typeof element === "boolean") {
      nodeType |= NODE_TYPE.__isNullNode__;
    } else {
      nodeType |= NODE_TYPE.__isTextNode__;
    }
  }

  return { nodeType, elementType };
}
