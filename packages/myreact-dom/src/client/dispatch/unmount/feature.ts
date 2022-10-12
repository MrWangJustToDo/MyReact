import { generateFiberToList } from "@my-react/react-reconciler";

import { clearFiberDom } from "./clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";
import type { LinkTreeList } from "@my-react/react-shared";

export const unmountFiber = (fiber: MyReactFiberNode) => {
  const list = generateFiberToList(fiber);
  unmountList(list);
};

export const unmountList = (list: LinkTreeList<MyReactFiberNode>) => {
  list.listToHead((f) => f.unmount());
  list.head.value && clearFiberDom(list.head.value);
};

export const unmount = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const unmountMap = globalDispatch.unmountMap;

  const allUnmountFiber = unmountMap[fiber.uid] || [];

  unmountMap[fiber.uid] = [];

  if (allUnmountFiber.length) allUnmountFiber.forEach((l) => unmountList(l));
};
