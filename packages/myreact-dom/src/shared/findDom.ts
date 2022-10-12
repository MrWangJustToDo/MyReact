import { __my_react_internal__ } from "@my-react/react";

import type { DomNode } from "./dom";
import type { MyReactFiberNode, MyReactInternalInstance } from "@my-react/react";

const { MyReactComponent } = __my_react_internal__;

const findDOMFromFiber = (fiber: MyReactFiberNode): DomNode | null => {
  const currentArray = [fiber];
  while (currentArray.length) {
    const next = currentArray.shift();
    if (next?.node) return next.node as DomNode;
    currentArray.push(...(next?.children || []));
  }
  return null;
};

const findDOMFromComponentFiber = (fiber: MyReactFiberNode) => {
  if (fiber) {
    if (fiber.node) return fiber.node as DomNode;
    for (let i = 0; i < fiber.children.length; i++) {
      const dom = findDOMFromFiber(fiber.children[i]);
      if (dom) return dom;
    }
  }
  return null;
};

export const findDOMNode = (instance: MyReactInternalInstance) => {
  if (instance instanceof MyReactComponent && instance._ownerFiber) {
    return findDOMFromComponentFiber(instance._ownerFiber);
  } else {
    return null;
  }
};
