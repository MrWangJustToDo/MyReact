import { isValidElement, __my_react_shared__ } from "@my-react/react";
import {
  Consumer,
  ForwardRef,
  Fragment,
  KeepLive,
  Lazy,
  Memo,
  Portal,
  Provider,
  Scope,
  Strict,
  Suspense,
  Comment,
  TYPEKEY,
  Profiler,
  merge,
  include,
} from "@my-react/react-shared";

import { devWarn } from "./debug";
import { NODE_TYPE } from "./fiberType";
import { getCurrentTypeFromRefresh } from "./refresh";

import type { MyReactElementNode, MyReactObjectComponent, forwardRef, memo, MyReactElement, MyReactElementType, MixinMyReactObjectComponent } from "@my-react/react";

const { enableHMRForDev } = __my_react_shared__;

type ReturnTypeFromElement = {
  nodeType: NODE_TYPE;
  key: MyReactElement["key"] | null;
  ref: MyReactElement["ref"] | null;
  pendingProps: MyReactElement["props"];
  elementType: MyReactElementType | null;
};

const emptyProps = {};

const getElementTypeFromType = (type: MixinMyReactObjectComponent): MyReactElementType => {
  while (typeof type === "object" && type !== null) {
    if (type[TYPEKEY] === Memo || type[TYPEKEY] === ForwardRef) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type = (type as ReturnType<typeof memo> | ReturnType<typeof forwardRef>).render;
    }
  }
  return type;
};

// TODO
export const getTypeFromElementNode = (element: MyReactElementNode): ReturnTypeFromElement => {
  let nodeType = NODE_TYPE.__initial__;

  if (isValidElement(element)) {
    return getTypeFromElement(element);
  } else {
    if (typeof element === "object" && element !== null) {
      if (__DEV__) {
        devWarn(`[@my-react/react] invalid object element type "${JSON.stringify(element)}"`);
      }
      nodeType = merge(nodeType, NODE_TYPE.__empty__);
    } else if (element === null || element === undefined || typeof element === "boolean" || typeof element === "function") {
      nodeType = merge(nodeType, NODE_TYPE.__null__);
    } else {
      // text element
      return { key: null, ref: null, nodeType: NODE_TYPE.__text__, elementType: String(element), pendingProps: emptyProps };
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

  if (typeof elementType === "object" && elementType !== null) {
    const typedElementType = elementType as MyReactObjectComponent;
    switch (typedElementType[TYPEKEY]) {
      case Provider:
        nodeType = merge(nodeType, NODE_TYPE.__provider__);
        break;
      case Consumer:
        nodeType = merge(nodeType, NODE_TYPE.__consumer__);
        break;
      case Memo:
        nodeType = merge(nodeType, NODE_TYPE.__memo__);
        elementType = (typedElementType as ReturnType<typeof memo>).render;
        break;
      case ForwardRef:
        nodeType = merge(nodeType, NODE_TYPE.__forwardRef__);
        elementType = (typedElementType as ReturnType<typeof forwardRef>).render;
        break;
      case Lazy:
        nodeType = merge(nodeType, NODE_TYPE.__lazy__);
        break;
      default:
        throw new Error(`[@my-react/react] invalid object element type "${typedElementType[TYPEKEY]?.toString()}"`);
    }
    if (typeof elementType === "object") {
      if (elementType[TYPEKEY] === ForwardRef) {
        nodeType = merge(nodeType, NODE_TYPE.__forwardRef__);
        elementType = (elementType as ReturnType<typeof forwardRef>).render;
      }
      if (elementType[TYPEKEY] === Provider) {
        nodeType = merge(nodeType, NODE_TYPE.__provider__);
      }
      if (elementType[TYPEKEY] === Consumer) {
        nodeType = merge(nodeType, NODE_TYPE.__consumer__);
      }
    }
    if (typeof elementType === "function") {
      if (elementType.prototype?.isMyReactComponent) {
        nodeType = merge(nodeType, NODE_TYPE.__class__);
      } else {
        nodeType = merge(nodeType, NODE_TYPE.__function__);
      }
    }
  } else if (typeof elementType === "function") {
    if (elementType.prototype?.isMyReactComponent) {
      nodeType = merge(nodeType, NODE_TYPE.__class__);
    } else {
      nodeType = merge(nodeType, NODE_TYPE.__function__);
    }
  } else if (typeof elementType === "symbol") {
    switch (elementType) {
      case KeepLive:
        nodeType = merge(nodeType, NODE_TYPE.__keepLive__);
        break;
      case Fragment:
        nodeType = merge(nodeType, NODE_TYPE.__fragment__);
        break;
      case Strict:
        nodeType = merge(nodeType, NODE_TYPE.__strict__);
        break;
      case Suspense:
        nodeType = merge(nodeType, NODE_TYPE.__suspense__);
        break;
      case Scope:
        nodeType = merge(nodeType, NODE_TYPE.__scope__);
        break;
      case Comment:
        nodeType = merge(nodeType, NODE_TYPE.__comment__);
        break;
      case Portal:
        nodeType = merge(nodeType, NODE_TYPE.__portal__);
        break;
      case Profiler:
        nodeType = merge(nodeType, NODE_TYPE.__profiler__);
        break;
      default:
        throw new Error(`[@my-react/react] invalid symbol element type "${elementType?.toString()}"`);
    }
  } else if (typeof elementType === "string") {
    nodeType = merge(nodeType, NODE_TYPE.__plain__);
  } else {
    if (__DEV__) {
      devWarn(`[@my-react/react] invalid element type "${elementType?.toString()}"`);
    }
    nodeType = merge(nodeType, NODE_TYPE.__empty__);
  }

  if (__DEV__ && enableHMRForDev.current && include(nodeType, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    elementType = getCurrentTypeFromRefresh(elementType);

    elementType = getElementTypeFromType(elementType);
  }

  return { key, ref, nodeType, elementType, pendingProps };
};
