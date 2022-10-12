import { LinkTreeList } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

const getNext = (fiber: MyReactFiberNode, root: MyReactFiberNode) => {
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;

  while (nextFiber && nextFiber !== root) {
    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }
};

export const generateFiberToList = (fiber: MyReactFiberNode) => {
  const listTree = new LinkTreeList<MyReactFiberNode>();

  let temp = fiber;

  listTree.append(temp, temp.fiberIndex);

  while ((temp = getNext(temp, fiber))) listTree.append(temp, temp.fiberIndex);

  return listTree;
};
