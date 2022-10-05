import type { MyReactElementNode, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react";

export const defaultGenerateKeepLiveMap = (fiber: MyReactFiberNode, map: Record<string, MyReactFiberNode[]>) => {
  const cacheArray = map[fiber.uid] || [];

  map[fiber.uid] = cacheArray;

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugKeepLiveCache = cacheArray;
  }
};

export const defaultGetKeepLiveFiber = (fiber: MyReactFiberNode, map: Record<string, MyReactFiberNode[]>, element: MyReactElementNode) => {
  const cacheArray = map[fiber.uid] || [];
  // <KeepLive> component only have one child;
  const currentChild = fiber.child;
  // set cache map
  map[fiber.uid] = cacheArray;
  // just a normal update
  if (currentChild.checkIsSameType(element)) {
    return currentChild;
  }
  if (cacheArray.every((f) => f.uid !== currentChild.uid)) {
    cacheArray.push(currentChild);
  }
  const cachedFiber = cacheArray.find((f) => f.checkIsSameType(element));

  map[fiber.uid] = cacheArray.filter((f) => f !== cachedFiber);

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugKeepLiveCache = map[fiber.uid];
  }

  return cachedFiber || null;
};
