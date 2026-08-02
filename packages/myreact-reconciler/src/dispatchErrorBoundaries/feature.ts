import { include, exclude, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";
import type { MixinMyReactClassComponent, MyReactComponent } from "@my-react/react/type";

export function isErrorBoundariesInstance(instance: MyReactComponent, Component: MixinMyReactClassComponent) {
  return typeof instance.componentDidCatch === "function" || typeof Component.getDerivedStateFromError === "function";
}

export function isErrorBoundariesComponent(fiber: MyReactFiberNode) {
  // Do not require __stable__ — a boundary mid-update (inherit/trigger bits) must still catch.
  if (include(fiber.type, NODE_TYPE.__class__) && exclude(fiber.state, STATE_TYPE.__unmount__)) {
    const Component = fiber.elementType;

    const typedComponent = Component as MixinMyReactClassComponent;

    const typedInstance = fiber.instance as MyReactComponent;

    return isErrorBoundariesInstance(typedInstance, typedComponent);
  }

  return false;
}

export function defaultResolveErrorBoundaries(fiber: MyReactFiberNode): MyReactFiberNode | null {
  let parent = fiber.parent;
  while (parent) {
    if (isErrorBoundariesComponent(parent)) {
      return parent;
    }
    parent = parent.parent;
  }

  return null;
}
