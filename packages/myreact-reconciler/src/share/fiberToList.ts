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

const getChild = (fiber: MyReactFiberNode) => {
  if (!fiber) return null;
  while (fiber.child) {
    fiber = fiber.child;
  }
  return fiber;
};

const getSibling = (fiber: MyReactFiberNode) => {
  return fiber?.sibling;
};

const getParent = (fiber: MyReactFiberNode) => {
  return fiber?.parent;
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

  let mode: "child" | "sibling" = "child";

  let current = fiber;

  while (current) {
    if (mode === "child") {
      let temp = getChild(current);
      if (temp) {
        // have a child
        if (temp !== current) {
          listTree.push(temp);
        } else {
          // try to get the sibling
          temp = getSibling(current);
          if (temp) {
            listTree.push(temp);
          } else {
            // no sibling, go back to parent
            temp = getParent(current);
            if (temp) {
              listTree.push(temp);
              mode = "sibling";
            }
          }
        }
      }
      current = temp;
    } else {
      let temp = getSibling(current);
      if (temp) {
        listTree.push(temp);
        mode = "child";
      } else {
        temp = getParent(current);
        if (temp) {
          listTree.push(temp);
        }
      }
      current = temp;
    }
  }

  return listTree;
};
