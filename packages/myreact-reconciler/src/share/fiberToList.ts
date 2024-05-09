import { ListTree } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../runtimeFiber";

const getNextForUnmountList = (fiber: MyReactFiberNode, root: MyReactFiberNode) => {
  if (fiber.child) return fiber.child;

  let nextFiber = fiber;

  while (nextFiber && nextFiber !== root) {
    if (nextFiber.sibling) return nextFiber.sibling;

    nextFiber = nextFiber.parent;
  }

  return null;
};

const getNextForMountList = (fiber: MyReactFiberNode) => {
  if (fiber.child) {
    while (fiber.child) {
      fiber = fiber.child;
    }
    return fiber;
  } else if (fiber.sibling) {
    return fiber.sibling;
  } else {
    return null;
  }
};

const getNextPlainFiberNode = (fiber: MyReactFiberNode) => {
  while (fiber && !fiber.sibling) {
    fiber = fiber.parent;
  }
  return fiber?.sibling;
};

export const generateFiberToUnmountList = (fiber: MyReactFiberNode) => {
  const listTree = new ListTree<MyReactFiberNode>();

  let temp = fiber;

  if (temp) {
    listTree.push(temp);
  }

  while (temp) {
    temp = getNextForUnmountList(temp, fiber);
    if (temp) listTree.push(temp);
  }

  return listTree;
};

export const generateFiberToMountList = (fiber: MyReactFiberNode) => {
  const listTree = new ListTree<MyReactFiberNode>();

  let current = fiber;

  let next = fiber;

  while (((next = getNextForMountList(current)), next)) {
    if (next) {
      listTree.push(next);
      current = next;
      continue;
    } else {
      current = current.parent;
      if (current) {
        listTree.push(current);
        current = getNextPlainFiberNode(current);
        if (!current) break;
      } else {
        break;
      }
    }
  }

  return listTree;
};
