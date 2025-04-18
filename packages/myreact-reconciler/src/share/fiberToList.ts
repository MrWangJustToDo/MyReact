import { include, ListTree, STATE_TYPE } from "@my-react/react-shared";

import type { MyReactFiberNode } from "../runtimeFiber";

export const generateFiberToMountList = (fiber: MyReactFiberNode) => {
  const listTree = new ListTree<MyReactFiberNode>();

  const getNext = (current: MyReactFiberNode) => {
    if (include(current.state, STATE_TYPE.__unmount__)) return;

    if (current.child) {
      getNext(current.child);
      return;
    }

    while (current && current !== fiber) {
      listTree.push(current);

      if (current.sibling) {
        getNext(current.sibling);
        return;
      }

      current = current.parent;
    }

    if (current === fiber) {
      listTree.push(current);
    }
  };

  getNext(fiber);

  return listTree;
};

export const generateFiberToUnmountList = generateFiberToMountList;
