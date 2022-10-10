import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactElementNode, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react";

export const defaultGenerateSuspenseMap = (fiber: MyReactFiberNode, map: Record<string, MyReactElementNode>) => {
  const parent = fiber.parent;
  const element = fiber.element;
  if (typeof element === "object" && fiber.type & NODE_TYPE.__isSuspenseNode__) {
    map[fiber.uid] = element?.props["fallback"] as MyReactElementNode;
  } else {
    if (parent) {
      map[fiber.uid] = map[parent.uid];
    } else {
      map[fiber.uid] = null;
    }
  }
  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugSuspense = map[fiber.uid];
  }
};
