import { __myreact_internal__ } from "@my-react/react";

import type { MyReactFiberNode, MyReactInternalInstance } from "@my-react/react";

const { MyReactComponent } = __myreact_internal__;

const findDOMFromFiber = (fiber: MyReactFiberNode) => {
  const currentArray = [fiber];
  while (currentArray.length) {
    const next = currentArray.shift();
    if (next?.dom) return next.dom;
    currentArray.push(...(next?.children || []));
  }
  return null;
};

const findDOMFromComponentFiber = (fiber: MyReactFiberNode) => {
  if (fiber) {
    if (fiber.dom) return fiber.dom;
    for (let i = 0; i < fiber.children.length; i++) {
      const dom = findDOMFromFiber(fiber.children[i]);
      if (dom) return dom;
    }
  }
  return null;
};

export const findDOMNode = (instance: MyReactInternalInstance) => {
  if (instance instanceof MyReactComponent && instance.__fiber__) {
    return findDOMFromComponentFiber(instance.__fiber__);
  } else {
    return null;
  }
};
