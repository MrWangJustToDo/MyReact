import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

export const isErrorBoundariesInstance = (instance: MyReactComponent, Component: MixinMyReactClassComponent) => {
  return typeof instance.componentDidCatch === "function" || typeof Component.getDerivedStateFromError === "function";
};

export const isErrorBoundariesComponent = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__class__) {
    const Component = fiber.elementType;

    const typedComponent = Component as MixinMyReactClassComponent;

    const typedInstance = fiber.instance as MyReactComponent;

    return isErrorBoundariesInstance(typedInstance, typedComponent);
  }

  return false;
};

export const defaultGenerateErrorBoundariesMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode | null>) => {
  const parent = fiber.parent;

  if (parent) {
    if (isErrorBoundariesComponent(parent)) {
      map.set(fiber, parent);
    } else {
      const parentErrorBoundaries = map.get(parent);

      parentErrorBoundaries && map.set(fiber, parentErrorBoundaries);
    }
  }

  if (__DEV__) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const errorBoundaries = map.get(fiber);

    errorBoundaries && (typedFiber._debugErrorBoundaries = errorBoundaries);
  }
};
