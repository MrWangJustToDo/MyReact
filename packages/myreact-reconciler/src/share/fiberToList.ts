import { ListTree } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../runtimeFiber";

export const generateFiberToMountList = (fiber: MyReactFiberNode) => {
  const listTree = new ListTree<MyReactFiberNode>();

  const getNext = (current: MyReactFiberNode) => {
    if (current.child) return getNext(current.child);

    while (current && current !== fiber) {
      listTree.push(current);

      if (current.sibling) return getNext(current.sibling);

      current = current.parent;
    }

    if (current === fiber) {
      listTree.push(current);
    }
  }

  getNext(fiber);

  return listTree;
};

export const generateFiberToUnmountList = generateFiberToMountList;