import { Component } from "@my-react/react";
import { STATE_TYPE, include } from "@my-react/react-shared";

import type { MyReactInternalInstance } from "@my-react/react";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";
import type { DomElement } from "@my-react-dom-shared";

/**
 * @internal
 */
export const findDOMFromFiber = (fiber: MyReactFiberNode | null): DomElement | undefined => {
  if (!fiber || include(fiber.state, STATE_TYPE.__unmount__)) return;

  const mayFiberContainer = fiber as MyReactFiberContainer;

  if (fiber.nativeNode) return fiber.nativeNode as DomElement;

  // only happen on the `root` / 'portal' fiber node
  // TODO need make sure current logic is same like React
  if (mayFiberContainer.containerNode) return mayFiberContainer.containerNode as DomElement;

  let child = fiber.child;

  while (child) {
    const dom = findDOMFromFiber(child);

    if (dom) return dom;

    child = child.sibling;
  }

  return;
};

export const findDOMNode = (instance: MyReactInternalInstance | Element): DomElement | null => {
  if (instance instanceof Component && instance._ownerFiber) {
    return findDOMFromFiber(instance._ownerFiber as MyReactFiberNode) || null;
  } else if ((instance as Element).nodeType === Node.ELEMENT_NODE) {
    return instance as DomElement;
  } else {
    return null;
  }
};
