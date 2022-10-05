import { generateFiberToList } from "@my-react/react-reconciler";

import { clearFiberDom } from "../unmount/clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";

export const deactivateFiber = (fiber: MyReactFiberNode) => {
  const listTree = generateFiberToList(fiber);

  clearFiberDom(fiber);

  listTree.listToHead((f) => {
    f.deactivate();
  });
};
