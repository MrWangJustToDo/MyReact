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

export const unmountFiberNode = (fiber?: MyReactFiberNode) => {
  if (!fiber) return;
  // unmountFiberNode(fiber.child);
  // fiber.unmount();
  // fiber.root.dispatch.removeFiber(fiber);
  // unmountFiberNode(fiber.sibling);
  
  // loop
  const dispatch = fiber.root.dispatch;
  const listTree = new LinkTreeList<MyReactFiberNode>();
  let temp = fiber;
  listTree.append(temp, temp.fiberIndex);
  while ((temp = getNext(temp, fiber))) listTree.append(temp, temp.fiberIndex);
  listTree.listToHead((f) => {
    f.unmount();
    dispatch.removeFiber(f);
  });
};
