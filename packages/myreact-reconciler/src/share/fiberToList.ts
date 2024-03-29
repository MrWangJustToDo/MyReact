import { ListTree } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../runtimeFiber";

const getNext = (fiber: MyReactFiberNode, root: MyReactFiberNode) => {
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;

  while (nextFiber && nextFiber !== root) {
    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  return null;
};

export const generateFiberToList = (fiber: MyReactFiberNode) => {
  const listTree = new ListTree<MyReactFiberNode>();

  let temp = fiber;

  if (temp) {
    listTree.push(temp);
  }

  while (temp) {
    temp = getNext(temp, fiber);
    if (temp) listTree.push(temp);
  }

  return listTree;
};
