import { generateFiberToList } from "@my-react/react-reconciler";

import { clearFiberDomWhenDeactivate } from "../unmount/clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";
import type { LinkTreeList } from "@my-react/react-shared";

export const deactivateFiber = (fiber: MyReactFiberNode) => {
  const listTree = generateFiberToList(fiber);

  listTree.listToHead((f) => f.deactivate());

  clearFiberDomWhenDeactivate(fiber);
};

export const deactivateList = (list: LinkTreeList<MyReactFiberNode>) => {
  list.listToHead((f) => f.deactivate());

  list.head.value && clearFiberDomWhenDeactivate(list.head.value);
};
