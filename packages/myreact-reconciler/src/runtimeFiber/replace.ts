// replace a fiber node in the render tree
import { createElement } from "@my-react/react";
import { STATE_TYPE } from "@my-react/react-shared";

import { unmountFiber } from "../dispatchUnmount";

import { MyReactFiberNode } from "./instance";

import type { MyReactFiberRoot } from "./instance";
import type { MyReactElementType } from "@my-react/react";

// just used for HMR
export const replaceFiberNode = (fiber: MyReactFiberNode | MyReactFiberRoot, nextType: MyReactElementType, forceRefresh?: boolean) => {
  const newElement = createElement(nextType, { ...fiber.pendingProps, ref: fiber.ref, key: fiber.key });

  if (forceRefresh) {
    const parent = fiber.parent;

    const newFiberNode = new MyReactFiberNode(newElement);

    newFiberNode.parent = parent;

    newFiberNode.container = parent.container;

    if (parent.child === fiber) parent.child = newFiberNode;

    newFiberNode.sibling = fiber.sibling;

    // unmount exist node
    unmountFiber(fiber);

    return newFiberNode;
  } else {
    fiber.element = newElement;

    fiber.elementType = nextType;

    fiber.state |= STATE_TYPE.__triggerSync__;

    return fiber;
  }
};
