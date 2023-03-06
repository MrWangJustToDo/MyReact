import { generateFiberToList } from "@my-react/react-reconciler";

import { unsetRef } from "@my-react-dom-shared";

import { clearFiberDom, clearFiberNode } from "./clearFiber";

import type { MyReactFiberNode } from "@my-react/react";
import type { RenderDispatch } from "@my-react/react-reconciler";
import type { ListTree } from "@my-react/react-shared";

export const unmountFiber = (fiber: MyReactFiberNode) => {
  const list = generateFiberToList(fiber);

  unmountList(list);
};

export const unmountList = (list: ListTree<MyReactFiberNode>) => {
  list.listToHead((f) => f.unmount());

  list.listToHead((f) => unsetRef(f));

  list.head.value && clearFiberDom(list.head.value);

  list.listToHead((f) => clearFiberNode(f));
};

export const unmount = (fiber: MyReactFiberNode) => {
  const renderDispatch = fiber.root.renderDispatch as RenderDispatch;

  const unmountMap = renderDispatch.unmountMap;

  const allUnmountFiber = unmountMap.get(fiber) || [];

  unmountMap.set(fiber, []);

  if (allUnmountFiber.length) allUnmountFiber.forEach((l) => unmountList(l));
};
