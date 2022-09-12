import { __my_react_internal__ } from "@my-react/react";

import type { MyReactFiberNode, MyReactFiberNodeDev, MyReactElementNode } from "@my-react/react";

const { NODE_TYPE } = __my_react_internal__;

export const isSVG = (_fiber: MyReactFiberNode, map: Record<string, boolean>) => {
  let _isSVG = _fiber.parent ? map[_fiber.parent.uid] : false;

  if (!_isSVG) {
    const element = _fiber.element;
    if (typeof element === "object" && element?.type === "svg") {
      _isSVG = true;
    }
  }

  _isSVG = Boolean(_isSVG);

  map[_fiber.uid] = _isSVG;

  return _isSVG;
};

export const generateStrictMap = (_fiber: MyReactFiberNode, map: Record<string, boolean>) => {
  const parent = _fiber.parent;
  const element = _fiber.element;
  if (typeof element === "object" && _fiber.type & NODE_TYPE.__isStrictNode__) {
    map[_fiber.uid] = true;
  } else {
    if (parent) {
      map[_fiber.uid] = Boolean(map[parent.uid]);
    } else {
      map[_fiber.uid] = false;
    }
  }
  if (__DEV__) {
    const typedFiber = _fiber as MyReactFiberNodeDev;

    typedFiber._debugStrict = map[_fiber.uid];
  }
};

export const generateSuspenseMap = (_fiber: MyReactFiberNode, map: Record<string, MyReactElementNode>) => {
  const parent = _fiber.parent;
  const element = _fiber.element;
  if (typeof element === "object" && _fiber.type & NODE_TYPE.__isSuspense__) {
    map[_fiber.uid] = element?.props["fallback"] as MyReactElementNode;
  } else {
    if (parent) {
      map[_fiber.uid] = map[parent.uid];
    } else {
      map[_fiber.uid] = null;
    }
  }
  if (__DEV__) {
    const typedFiber = _fiber as MyReactFiberNodeDev;

    typedFiber._debugSuspense = map[_fiber.uid];
  }
};
