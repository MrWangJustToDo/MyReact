import { NODE_TYPE } from "@my-react/react-shared";

import type { DomElement } from "./dom";
import type { MyReactFiberNode, MyReactElement } from "@my-react/react";

export const generateSVGElementType = (_fiber: MyReactFiberNode, map: Record<string, boolean>) => {
  let isSVG = _fiber.parent ? map[_fiber.parent.uid] : false;

  if (!isSVG) {
    const element = _fiber.element;
    if (typeof element === "object" && element?.type === "svg") {
      isSVG = true;
    }
  }

  map[_fiber.uid] = isSVG;

  return isSVG;
};

export const setRef = (_fiber: MyReactFiberNode) => {
  if (_fiber.type & NODE_TYPE.__isPlainNode__) {
    const typedElement = _fiber.element as MyReactElement;
    if (_fiber.node) {
      const typedNode = _fiber.node as DomElement;
      const ref = typedElement.ref;
      if (typeof ref === "object" && ref !== null) {
        ref.current = typedNode;
      } else if (typeof ref === "function") {
        ref(typedNode);
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
