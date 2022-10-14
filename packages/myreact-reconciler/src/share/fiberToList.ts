import { LinkTreeList } from "@my-react/react-shared";

import type { MyReactFiberNode } from "@my-react/react";

const getNext = (fiber: MyReactFiberNode, root: MyReactFiberNode, listTree: LinkTreeList<MyReactFiberNode>) => {
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;

  while (nextFiber && nextFiber !== root) {
    listTree.append(nextFiber);

    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  if (nextFiber === root) {
    listTree.append(nextFiber);
  }

  return null;
};

export const generateFiberToList = (fiber: MyReactFiberNode) => {
  const listTree = new LinkTreeList<MyReactFiberNode>();

  let temp = fiber;

  while (temp) {
    temp = getNext(temp, fiber, listTree);
  }

  return listTree;
};
