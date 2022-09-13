import { getFiberWithDom } from "./getFiberWithDom";

import type { MyReactFiberNode } from "@my-react/react";

const getInsertBeforeDomFromSibling = (fiber: MyReactFiberNode | null): MyReactFiberNode | null => {
  if (!fiber) return null;

  const sibling = fiber.sibling;

  if (sibling) {
    return getFiberWithDom(sibling, (f) => f.children) || getInsertBeforeDomFromSibling(sibling);
  } else {
    return null;
  }
};

export const getInsertBeforeDomFromSiblingAndParent = (
  fiber: MyReactFiberNode | null,
  parentFiber: MyReactFiberNode | null
): MyReactFiberNode | null => {
  if (!fiber) return null;

  if (fiber === parentFiber) return null;

  const beforeDom = getInsertBeforeDomFromSibling(fiber);

  if (beforeDom) return beforeDom;

  return getInsertBeforeDomFromSiblingAndParent(fiber.parent, parentFiber) as MyReactFiberNode | null;
};
