import { NODE_TYPE } from "@my-react/react-shared";

import { checkIsSameType } from "../share";

import type { MyReactFiberNodeDev } from "../fiber";
import type { MyReactElementNode, MyReactFiberNode } from "@my-react/react";

export const defaultGenerateKeepLiveMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode[]>) => {
  if (fiber.type & NODE_TYPE.__isKeepLiveNode__) {
    const cacheArray = map.get(fiber) || [];

    map.set(fiber, cacheArray);

    if (__DEV__) {
      const typedFiber = fiber as MyReactFiberNodeDev;

      typedFiber._debugKeepLiveCache = cacheArray;
    }
  }
};

export const defaultGetKeepLiveFiber = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode[]>, element: MyReactElementNode) => {
  const cacheArray = map.get(fiber) || [];
  // <KeepLive> component only have one child;
  const currentChild = fiber.child;
  // TODO
  // just a normal update
  if (checkIsSameType(currentChild, element)) return currentChild;

  if (cacheArray.every((f) => f !== currentChild)) {
    cacheArray.push(currentChild);
  }

  const cachedFiber = cacheArray.find((f) => checkIsSameType(f, element));

  const newCacheArray = cacheArray.filter((f) => f !== cachedFiber);

  map.set(fiber, newCacheArray);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugKeepLiveCache = newCacheArray;
  }

  return cachedFiber || null;
};
