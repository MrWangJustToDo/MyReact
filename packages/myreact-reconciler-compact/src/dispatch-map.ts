import { NODE_TYPE } from "@my-react/react-reconciler";
import { exclude, include, STATE_TYPE } from "@my-react/react-shared";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberNode, MyReactFiberContainer, MyReactFiberRoot } from "@my-react/react-reconciler";

export const initialMap = (dispatch: ReconcilerDispatch, fiber: MyReactFiberNode, config: any) => {
  let parentFiberWithNode: MyReactFiberNode | null = null;

  let parentFiberHostContext: any | null = null;

  let hostContext: any | null = null;

  if (fiber.parent) {
    const mayFiberContainer = fiber.parent as MyReactFiberContainer;

    if (mayFiberContainer.containerNode) {
      parentFiberWithNode = fiber.parent;
    } else if (include(fiber.parent.type, dispatch.runtimeRef.typeForNativeNode)) {
      parentFiberWithNode = fiber.parent;
    } else {
      parentFiberWithNode = dispatch.runtimeDom.elementMap.get(fiber.parent) || dispatch.rootFiber;
    }

    parentFiberHostContext = dispatch.runtimeDom.hostContextMap.get(parentFiberWithNode);

    if (checkFiberWithNativeNode(dispatch, fiber)) {
      hostContext = config.getChildHostContext(parentFiberHostContext, fiber.elementType, dispatch.rootNode, fiber);
    } else {
      hostContext = parentFiberHostContext;
    }
  } else {
    hostContext = config.getRootHostContext(dispatch.rootNode);
  }

  if (parentFiberWithNode) {
    dispatch.runtimeDom.elementMap.set(fiber, parentFiberWithNode);
  }

  dispatch.runtimeDom.hostContextMap.set(fiber, hostContext);
};

export const unmountMap = (dispatch: ReconcilerDispatch, fiber: MyReactFiberNode) => {
  dispatch.runtimeDom.hostContextMap.delete(fiber);

  dispatch.runtimeDom.elementMap.delete(fiber);
};

export const getFiberWithNativeNode = (
  fiber: MyReactFiberNode | null,
  transform: (f: MyReactFiberNode) => MyReactFiberNode | null
): MyReactFiberNode | null => {
  while (fiber) {
    const maybeContainer = fiber as MyReactFiberContainer;

    if (fiber.nativeNode && exclude(fiber.state, STATE_TYPE.__unmount__)) return fiber;

    if (maybeContainer.containerNode && exclude(maybeContainer.state, STATE_TYPE.__unmount__)) return fiber;

    fiber = transform(fiber);
  }

  return null;
};

export const getValidParentFiberWithNode = (_dispatch: ReconcilerDispatch, _fiber: MyReactFiberNode) => {
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

const checkFiberWithNativeNode = (dispatch: ReconcilerDispatch, fiber: MyReactFiberNode): boolean => {
  const maybeContainer = fiber as MyReactFiberContainer;

  const maybeRoot = fiber as MyReactFiberRoot;

  if (include(fiber.state, STATE_TYPE.__unmount__)) return false;

  if (maybeContainer.containerNode) return true;

  if (maybeRoot.renderDispatch?.rootNode) return true;

  if (include(fiber.type, dispatch.runtimeRef.typeForNativeNode)) {
    return true;
  }

  return false;
};
