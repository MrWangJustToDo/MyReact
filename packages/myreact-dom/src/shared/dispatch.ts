import { NODE_TYPE } from "@my-react/react-shared";

import type { DomFiberNode } from "./dom";
import type { MyReactFiberNode, MyReactFiberNodeDev, MyReactElementNode, MyReactElement } from "@my-react/react";

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

export const setRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElement = _fiber.element as MyReactElement;
    if (_fiber.node) {
      const typedNode = _fiber.node as DomFiberNode;
      const ref = typedElement.ref;
      if (typeof ref === "object" && ref !== null) {
        ref.current = typedNode.element;
      } else if (typeof ref === "function") {
        ref(typedNode.element);
      }
    } else {
      throw new Error("plain element do not have a native node");
    }
  }
  if (_fiber.type & NODE_TYPE.__isClassComponent__) {
    const typedElement = _fiber.element as MyReactElement;
    if (_fiber.instance) {
      const ref = typedElement.ref;
      if (typeof ref === "object" && ref !== null) {
        ref.current = _fiber.instance;
      } else if (typeof ref === "function") {
        ref(_fiber.instance);
      }
    } else {
      throw new Error("class component do not have a instance");
    }
  }
};
