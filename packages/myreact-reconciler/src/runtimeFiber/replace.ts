// replace a fiber node in the render tree

import { cloneElement } from "@my-react/react";
import { PATCH_TYPE } from "@my-react/react-shared";

import { unmountFiber } from "../dispatchUnmount";
import { debugWithNode } from "../share";

import { MyReactFiberNode, MyReactFiberRoot } from "./instance";

import type { MyReactFiberNodeDev } from "./interface";
import type { MyReactElementType } from "@my-react/react";

// just used for HMR
export const replaceFiberNode = (fiber: MyReactFiberNode | MyReactFiberRoot, nextType: MyReactElementType) => {
  if (fiber instanceof MyReactFiberRoot) {
    fiber.elementType = nextType;
    return fiber;
  }

  const parent = fiber.parent;

  const element = fiber.element;

  const clonedElement = cloneElement(element);

  const newFiberNode = new MyReactFiberNode(clonedElement);

  newFiberNode.elementType = nextType;

  newFiberNode.parent = parent;

  newFiberNode.container = parent.container;

  if (parent.child === fiber) parent.child = newFiberNode;

  newFiberNode.sibling = fiber.sibling;

  const renderDispatch = parent.container.renderDispatch;

  renderDispatch.pendingCreate(newFiberNode);

  renderDispatch.pendingUpdate(newFiberNode);

  renderDispatch.pendingPosition(newFiberNode);

  if (newFiberNode.ref) {
    renderDispatch.pendingRef(newFiberNode);
  }

  renderDispatch.resolveScopeMap(newFiberNode);

  renderDispatch.resolveStrictMap(newFiberNode);

  renderDispatch.resolveContextMap(newFiberNode);

  renderDispatch.resolveSuspenseMap(newFiberNode);

  renderDispatch.resolveErrorBoundariesMap(newFiberNode);

  renderDispatch.patchToFiberInitial?.(newFiberNode);

  if (!(newFiberNode.patch & PATCH_TYPE.__update__)) {
    newFiberNode.memoizedProps = newFiberNode.pendingProps;
  }

  if (__DEV__) {
    const typedFiber = newFiberNode as MyReactFiberNodeDev;

    const timeNow = Date.now();

    typedFiber._debugRenderState = {
      renderCount: 1,
      mountTime: timeNow,
      prevUpdateTime: 0,
      currentUpdateTime: timeNow,
    };

    if (typedFiber.type & renderDispatch.hasNodeType) {
      renderDispatch.pendingLayoutEffect(typedFiber, () => debugWithNode(typedFiber));
    }
  }

  // unmount exist node
  unmountFiber(fiber);

  return newFiberNode;
};
