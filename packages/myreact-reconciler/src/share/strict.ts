import { NODE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react";

export const defaultGenerateStrictMap = (fiber: MyReactFiberNode, map: Record<string, boolean>) => {
  const parent = fiber.parent;
  const element = fiber.element;
  if (typeof element === "object" && fiber.type & NODE_TYPE.__isStrictNode__) {
    map[fiber.uid] = true;
  } else {
    if (parent) {
      map[fiber.uid] = Boolean(map[parent.uid]);
    } else {
      map[fiber.uid] = false;
    }
  }
  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    typedFiber._debugStrict = map[fiber.uid];
  }
};
