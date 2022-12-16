import { NODE_TYPE } from "@my-react/react-shared";

import type { memo, MixinMyReactComponentType, MyReactClassComponent, MyReactComponentStaticType, MyReactElement, MyReactFiberNode } from "@my-react/react";

export const isErrorBoundariesComponent = (fiber: MyReactFiberNode) => {
  if (fiber.type & NODE_TYPE.__isClassComponent__) {
    const typedElement = fiber.element as MyReactElement;

    const Component = fiber.type & NODE_TYPE.__isDynamicNode__ ? typedElement.type : (typedElement.type as ReturnType<typeof memo>).render;

    const typedComponent = Component as MyReactClassComponent & MyReactComponentStaticType;

    const typedInstance = fiber.instance as MixinMyReactComponentType;

    if (typeof typedComponent.getDerivedStateFromError === "function" || typeof typedInstance.componentDidCatch === "function") {
      return true;
    }
  }

  return false;
};

export const defaultGenerateErrorBoundariesMap = (fiber: MyReactFiberNode, map: Record<string, MyReactFiberNode | undefined>) => {
  if (isErrorBoundariesComponent(fiber)) {
    map[fiber.uid] = fiber;
  } else {
    const parent = fiber.parent;

    if (parent) {
      map[fiber.uid] = map[parent.uid];
    } else {
      map[fiber.uid] = undefined;
    }
  }
};
