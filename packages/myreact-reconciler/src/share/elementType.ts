import { isValidElement, __my_react_internal__ } from "@my-react/react";
import { Consumer, ForwardRef, Fragment, KeepLive, Lazy, Memo, Portal, Provider, Scope, Strict, Suspense, Comment, TYPEKEY } from "@my-react/react-shared";

import { NODE_TYPE } from "./fiberType";

import type { MyReactElementNode, MyReactObjectComponent, forwardRef, memo, MyReactElement, MyReactElementType } from "@my-react/react";

const { currentRenderPlatform } = __my_react_internal__;

type ReturnTypeFromElement = {
  nodeType: NODE_TYPE;
  key: MyReactElement["key"] | null;
  ref: MyReactElement["ref"] | null;
  pendingProps: MyReactElement["props"];
  elementType: MyReactElementType | null;
};

const emptyProps = {};

export const getTypeFromElementNode = (element: MyReactElementNode): ReturnTypeFromElement => {
  let nodeType = NODE_TYPE.__initial__;

  const renderPlatform = currentRenderPlatform.current;

  if (isValidElement(element)) {
    return getTypeFromElement(element);
  } else {
    if (typeof element === "object" && element !== null) {
      if (__DEV__) {
        renderPlatform?.log({ message: `invalid object element type ${JSON.stringify(element)}`, level: "warn", triggerOnce: true });
      }
      nodeType |= NODE_TYPE.__empty__;
    } else if (element === null || element === undefined || typeof element === "boolean") {
      nodeType |= NODE_TYPE.__null__;
    } else {
      nodeType |= NODE_TYPE.__text__;
    }
  }

  return { key: null, ref: null, nodeType, elementType: null, pendingProps: emptyProps };
};

export const getTypeFromElement = (element: MyReactElement): ReturnTypeFromElement => {
  let nodeType = NODE_TYPE.__initial__;

  let elementType = element.type;

  const pendingProps = element.props;

  const ref: MyReactElement["ref"] | null = element.ref;

  const key: MyReactElement["key"] | null = element.key;

  const renderPlatform = currentRenderPlatform.current;

  if (typeof elementType === "object") {
    const typedElementType = elementType as MyReactObjectComponent;
    switch (typedElementType[TYPEKEY]) {
      case Provider:
        nodeType |= NODE_TYPE.__provider__;
        break;
      case Consumer:
        nodeType |= NODE_TYPE.__consumer__;
        break;
      case Memo:
        nodeType |= NODE_TYPE.__memo__;
        elementType = (typedElementType as ReturnType<typeof memo>).render;
        break;
      case ForwardRef:
        nodeType |= NODE_TYPE.__forwardRef__;
        elementType = (typedElementType as ReturnType<typeof forwardRef>).render;
        break;
      case Lazy:
        nodeType |= NODE_TYPE.__lazy__;
        break;
      default:
        throw new Error(`invalid object element type ${typedElementType[TYPEKEY]?.toString()}`);
    }
    if (typeof elementType === "object") {
      if (elementType[TYPEKEY] === ForwardRef) {
        nodeType |= NODE_TYPE.__forwardRef__;
        elementType = (elementType as ReturnType<typeof forwardRef>).render;
      }
    }
    if (typeof elementType === "function") {
      if (elementType.prototype?.isMyReactComponent) {
        nodeType |= NODE_TYPE.__class__;
      } else {
        nodeType |= NODE_TYPE.__function__;
      }
    }
  } else if (typeof elementType === "function") {
    if (elementType.prototype?.isMyReactComponent) {
      nodeType |= NODE_TYPE.__class__;
    } else {
      nodeType |= NODE_TYPE.__function__;
    }
  } else if (typeof elementType === "symbol") {
    switch (elementType) {
      case KeepLive:
        nodeType |= NODE_TYPE.__keepLive__;
        break;
      case Fragment:
        nodeType |= NODE_TYPE.__fragment__;
        break;
      case Strict:
        nodeType |= NODE_TYPE.__strict__;
        break;
      case Suspense:
        nodeType |= NODE_TYPE.__suspense__;
        break;
      case Scope:
        nodeType |= NODE_TYPE.__scope__;
        break;
      case Comment:
        nodeType |= NODE_TYPE.__comment__;
        break;
      case Portal:
        nodeType |= NODE_TYPE.__portal__;
        break;
      default:
        throw new Error(`invalid symbol element type ${elementType?.toString()}`);
    }
  } else if (typeof elementType === "string") {
    nodeType |= NODE_TYPE.__plain__;
  } else {
    if (__DEV__) {
      renderPlatform?.log({ message: `invalid element type ${elementType?.toString()}`, level: "warn", triggerOnce: true });
    }
    nodeType |= NODE_TYPE.__empty__;
  }

  return { key, ref, nodeType, elementType, pendingProps };
};
