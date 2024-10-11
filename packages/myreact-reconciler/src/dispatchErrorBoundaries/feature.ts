import { __my_react_shared__ } from "@my-react/react";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode, MyReactFiberNodeDev } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react";

const { enableDebugFiled } = __my_react_shared__;

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

export const defaultGenerateErrorBoundariesMap = (fiber: MyReactFiberNode, map: WeakMap<MyReactFiberNode, MyReactFiberNode | null>) => {
  const parent = fiber.parent;

  if (parent) {
    if (isErrorBoundariesComponent(parent)) {
      map.set(fiber, parent);
    } else {
      const parentErrorBoundaries = map.get(parent);

      if (parentErrorBoundaries) {
        if (parentErrorBoundaries.state & STATE_TYPE.__unmount__) {
          map.delete(parent);

          map.delete(fiber);
        } else {
          map.set(fiber, parentErrorBoundaries);
        }
      }
    }
  }

  if (__DEV__ && enableDebugFiled.current) {
    const typedFiber = fiber as MyReactFiberNodeDev;

    const errorBoundaries = map.get(fiber);

    if (errorBoundaries) {
      typedFiber._debugErrorBoundaries = errorBoundaries;
    } else {
      typedFiber._debugErrorBoundaries = null;
    }
  }
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
