import { checkIsSameType, NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";

// TODO
export const defaultGenerateKeepLiveMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode[]>) => {
  if (fiber.type & NODE_TYPE.__isKeepLiveNode__) {
    const cacheArray = map.get(fiber) || [];

    map.set(fiber, cacheArray);
  }
};

export const defaultGetKeepLiveFiber = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode[]>, element: MyReactElementNode) => {
  const cacheArray = map.get(fiber) || [];
  // <KeepLive> component only have one child;
  const currentChild = fiber.child;
  // just a normal update
  if (checkIsSameType(currentChild, element)) return currentChild;

  if (cacheArray.every((f) => f !== currentChild)) {
    cacheArray.push(currentChild);
  }

  const cachedFiber = cacheArray.find((f) => checkIsSameType(f, element));

  const newCacheArray = cacheArray.filter((f) => f !== cachedFiber);

  map.set(fiber, newCacheArray);

  return cachedFiber || null;
};
