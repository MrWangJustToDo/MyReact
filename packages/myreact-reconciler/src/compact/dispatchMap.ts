import { exclude, include, STATE_TYPE } from "@my-react/react-shared";

import { NODE_TYPE } from "../share";

import type { MyReactFiberContainer, MyReactFiberNode } from "../runtimeFiber";
import type { ReconcilerDispatch } from "./dispatch";

export const initialMap = (fiber: MyReactFiberNode, dispatch: ReconcilerDispatch, config: any) => {
  let parentFiberWithNode: MyReactFiberNode | null = null;

  let parentFiberHostContext: any | null = null;

  let hostContext: any | null = null;

  if (fiber.parent) {
    parentFiberHostContext = dispatch.runtimeDom.hostContextMap.get(fiber.parent);

    hostContext = config.getChildHostContext(parentFiberHostContext, fiber.elementType, dispatch.rootNode);

    const mayFiberContainer = fiber.parent as MyReactFiberContainer;

    if (mayFiberContainer.containerNode) {
      parentFiberWithNode = fiber.parent;
    } else if (include(fiber.parent.type, dispatch.runtimeRef.typeForNativeNode)) {
      parentFiberWithNode = fiber.parent;
    } else {
      parentFiberWithNode = dispatch.runtimeDom.elementMap.get(fiber.parent);
    }
  } else {
    hostContext = config.getRootHostContext(dispatch.rootNode);
  }

  if (parentFiberWithNode) {
    dispatch.runtimeDom.elementMap.set(fiber, parentFiberWithNode);
  }

  if (parentFiberHostContext) {
    dispatch.runtimeDom.hostContextMap.set(fiber, hostContext);
  }
};

export const unmountMap = (fiber: MyReactFiberNode, dispatch: ReconcilerDispatch) => {
  dispatch.runtimeDom.hostContextMap.delete(fiber);

  dispatch.runtimeDom.elementMap.delete(fiber);
};

export const getFiberWithNativeNode = (fiber: MyReactFiberNode | null, transform: (f: MyReactFiberNode) => MyReactFiberNode | null): MyReactFiberNode | null => {
  while (fiber) {
    const maybeContainer = fiber as MyReactFiberContainer;

    if (fiber.nativeNode && exclude(fiber.state, STATE_TYPE.__unmount__)) return fiber;

    if (maybeContainer.containerNode && exclude(maybeContainer.state, STATE_TYPE.__unmount__)) return fiber;

    fiber = transform(fiber);
  }

  return null;
};

export const getValidParentFiberWithNode = (_fiber: MyReactFiberNode, _dispatch: ReconcilerDispatch) => {
  let parentFiberWithNode = _dispatch.runtimeDom.elementMap.get(_fiber);

  if (!parentFiberWithNode || include(parentFiberWithNode.state, STATE_TYPE.__unmount__)) {
    parentFiberWithNode = getFiberWithNativeNode(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

    _dispatch.runtimeDom.elementMap.set(_fiber, parentFiberWithNode);
  }

  return parentFiberWithNode;
};

const findFiberWithNodeFromFiber = (fiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber || include(fiber.state, STATE_TYPE.__unmount__)) return null;

  if (include(fiber.type, NODE_TYPE.__portal__)) return null;

  if (fiber.nativeNode) return fiber;

  let child = fiber.child;

  while (child) {
    const childWithDom = findFiberWithNodeFromFiber(child);

    if (childWithDom) return childWithDom;

    child = child.sibling;
  }

  return null;
};

const getInsertBeforeNodeFromSibling = (fiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber) return null;

  return findFiberWithNodeFromFiber(fiber) || getInsertBeforeNodeFromSibling(fiber?.sibling);
};

export const getInsertBeforeNodeFromSiblingAndParent = (fiber: MyReactFiberNode | null, parentFiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber) return null;

  if (fiber === parentFiber) return null;

  const beforeDom = getInsertBeforeNodeFromSibling(fiber.sibling);

  if (beforeDom) return beforeDom;

  return getInsertBeforeNodeFromSiblingAndParent(fiber.parent, parentFiber) as MyReactFiberNode | null;
};