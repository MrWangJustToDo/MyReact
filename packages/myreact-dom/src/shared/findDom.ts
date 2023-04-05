import { Component } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import type { DomNode } from "./dom";
import type { MyReactInternalInstance } from "@my-react/react";
import type { MyReactFiberContainer, MyReactFiberNode } from "@my-react/react-reconciler";

export const findDOMFromFiber = (fiber: MyReactFiberNode | null) => {
  if (!fiber || fiber.state & STATE_TYPE.__unmount__) return;

  const mayFiberContainer = fiber as MyReactFiberContainer;

  if (fiber.nativeNode) return fiber.nativeNode as DomNode;

  // only happen on the `root` / 'portal' fiber node
  // TODO need make sure current logic is same like React
  if (mayFiberContainer.containerNode) return mayFiberContainer.containerNode as DomNode;

  let child = fiber.child;

  while (child) {
    const dom = findDOMFromFiber(child);

    if (dom) return dom;

    child = child.sibling;
  }

  return null;
};

export const findDOMNode = (instance: MyReactInternalInstance) => {
  if (instance instanceof Component && instance._ownerFiber) {
    return findDOMFromFiber(instance._ownerFiber as MyReactFiberNode);
  } else {
    return null;
  }
};
