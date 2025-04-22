import { include, ListTree, STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../runtimeFiber";

export const generateFiberToMountList = (fiber: MyReactFiberNode) => {
  const listTree = new ListTree<MyReactFiberNode>();

  const getNext = (fiber: MyReactFiberNode, root: MyReactFiberNode) => {
    if (include(fiber.state, STATE_TYPE.__unmount__)) return null;
  
    if (fiber.child) return fiber.child;
  
    while (fiber && fiber !== root) {
      listTree.push(fiber);

      if (fiber.sibling) return fiber.sibling;

      fiber = fiber.parent;
    }

    if (fiber === root) {
      listTree.push(fiber);
    }

    return null;
  }

  let f = fiber;

  while(f) {
    f = getNext(f, fiber);
  }

  return listTree;
};

export const generateFiberToUnmountList = generateFiberToMountList;
