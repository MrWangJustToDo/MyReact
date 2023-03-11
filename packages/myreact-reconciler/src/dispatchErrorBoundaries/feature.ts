import { NODE_TYPE } from "../share";

import type { MyReactFiberNodeDev } from "../runtimeFiber";
import type { memo, MixinMyReactComponentType, MyReactClassComponent, MyReactComponentStaticType, MyReactFiberNode } from "@my-react/react";

export const isErrorBoundariesComponent = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isClassComponent__) {
    const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? fiber.elementType : (fiber.elementType as ReturnType<typeof memo>).render;

    const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

    const typedInstance = fiber.instance as MixinMyReactComponentType;

    if (typeof typedComponent.getDerivedStateFromError === "function" || typeof typedInstance.componentDidCatch === "function") {
      return true;
    }
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
