import { include } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

export const isErrorBoundariesInstance = (instance: MyReactComponent, Component: MixinMyReactClassComponent) => {
  return typeof instance.componentDidCatch === "function" || typeof Component.getDerivedStateFromError === "function";
};

export const isErrorBoundariesComponent = (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__class__)) {
    const Component = fiber.elementType;

    const typedComponent = Component as MixinMyReactClassComponent;

    const typedInstance = fiber.instance as MyReactComponent;

    return isErrorBoundariesInstance(typedInstance, typedComponent);
  }

  return false;
};

export const defaultResolveErrorBoundaries = (fiber: MyReactFiberNode): MyReactFiberNode | null => {
  let parent = fiber.parent;
  while (parent) {
    if (isErrorBoundariesComponent(parent)) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
};
