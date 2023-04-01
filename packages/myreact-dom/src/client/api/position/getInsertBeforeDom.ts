import { NODE_TYPE } from "@my-react/react-reconciler";
import { STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const findFiberWithDOMFromFiber = (fiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber || fiber.state & STATE_TYPE.__unmount__) return null;

  if (fiber.nativeNode) return fiber;

  let child = fiber.child;

  while (child) {
    const childWithDom = findFiberWithDOMFromFiber(child);

    if (childWithDom) return childWithDom;

    child = child.sibling;
  }

  return null;
};

const getInsertBeforeDomFromSibling = (fiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber) return null;

  return findFiberWithDOMFromFiber(fiber) || getInsertBeforeDomFromSibling(fiber?.sibling);
};

export const getInsertBeforeDomFromSiblingAndParent = (fiber: MyReactFiberNode | null, parentFiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber) return null;

  if (fiber === parentFiber) return null;

  const beforeDom = getInsertBeforeDomFromSibling(fiber.sibling);

  if (beforeDom) {
    if (beforeDom.type & NODE_TYPE.__portal__) {
      return null;
    } else {
      return beforeDom;
    }
  }

  return getInsertBeforeDomFromSiblingAndParent(fiber.parent, parentFiber) as MyReactFiberNode | null;
};
