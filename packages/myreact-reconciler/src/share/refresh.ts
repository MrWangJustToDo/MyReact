import {
  createElement,
  type MixinMyReactClassComponent,
  type MixinMyReactFunctionComponent,
  type MyReactElement,
  type MyReactElementType,
} from "@my-react/react";
import { include } from "@my-react/react-shared";

import { getElementTypeFromType } from "./elementType";
import { currentRefreshHandler, fiberToDispatchMap } from "./env";
import { NODE_TYPE } from "./fiberType";
import { MyWeakMap } from "./map";

import type { MyReactFiberNode } from "../runtimeFiber";

export type RefreshHandler = (type: MyReactElementType) => { current: MyReactElementType };

let refreshHandler: RefreshHandler | null = null;

// used for hmr
export const typeToFibersMap = new MyWeakMap() as WeakMap<MixinMyReactClassComponent | MixinMyReactFunctionComponent, Set<MyReactFiberNode>>;

export const setRefreshHandler = (handler: RefreshHandler) => {
  if (__DEV__) {
    if (refreshHandler) {
      throw new Error(`[@my-react/react] "refreshHandler" can be only set once`);
    }

    currentRefreshHandler.current = handler;

    refreshHandler = handler;
  }
};

export const setRefreshTypeMap = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__ | NODE_TYPE.__function__)) {
    const elementType = fiber.elementType as MixinMyReactClassComponent | MixinMyReactFunctionComponent;

    const exist = typeToFibersMap.get(elementType) || new Set();

    exist.add(fiber);

    typeToFibersMap.set(elementType, exist);
  }
};

export const getCurrentTypeFromRefresh = (type: MyReactElementType) => {
  return refreshHandler?.(type)?.current || type;
};

export const getCurrentTypeFromRefreshOnly = (type: MyReactElementType) => {
  return refreshHandler?.(type)?.current;
};

export const getCurrentFibersFromType = (type: MixinMyReactClassComponent | MixinMyReactFunctionComponent) => {
  return typeToFibersMap.get(type);
};

export const getCurrentDispatchFromType = (type: MixinMyReactClassComponent | MixinMyReactFunctionComponent) => {
  const fibers = getCurrentFibersFromType(type);

  return new Set(Array.from(fibers || []).map((fiber) => fiberToDispatchMap.get(fiber)));
};

export const getCurrentDispatchFromFiber = (fiber: MyReactFiberNode) => {
  return fiberToDispatchMap.get(fiber);
};

export const getElementFromRefreshIfExist = (element: MyReactElement) => {
  const elementType = getElementTypeFromType(element.type);

  // current element is React component
  if (typeof elementType === "function") {
    const typeFromRefresh = getCurrentTypeFromRefreshOnly(elementType);

    // have a new version elementType from hmr runtime
    if (typeFromRefresh) {
      return createElement(typeFromRefresh, { ...element.props, key: element.key ?? undefined, ref: element.ref ?? undefined });
    }
  }

  return element;
};
