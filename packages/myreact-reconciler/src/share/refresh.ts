import { include } from "@my-react/react-shared";

import { currentRefreshHandler, fiberToDispatchMap } from "./env";
import { NODE_TYPE } from "./fiberType";
import { MyWeakMap } from "./map";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MixinMyReactFunctionComponent, MyReactElementType } from "@my-react/react";

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
  const family = refreshHandler?.(type);

  return family?.current || type;
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
