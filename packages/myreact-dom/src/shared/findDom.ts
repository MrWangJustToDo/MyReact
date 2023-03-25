import { __my_react_internal__ } from "@my-react/react";

import type { DomNode } from "./dom";
import type { MyReactFiberNode, MyReactInternalInstance } from "@my-react/react";

const { MyReactComponent } = __my_react_internal__;

export const findDOMFromFiber = (fiber: MyReactFiberNode | null) => {
  if (!fiber || !fiber.isMounted) return;

  if (fiber.node) return fiber.node as DomNode;

  let child = fiber.child;

  while (child) {
    const dom = findDOMFromFiber(child);

    if (dom) return dom;

    child = child.sibling;
  }

  return null;
};

export const findDOMNode = (instance: MyReactInternalInstance) => {
  if (instance instanceof MyReactComponent && instance._ownerFiber) {
    return findDOMFromFiber(instance._ownerFiber);
  } else {
    return null;
  }
};
