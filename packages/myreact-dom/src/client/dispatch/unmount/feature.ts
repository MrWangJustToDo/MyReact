import { unmountFiberNode } from "@my-react/react-reconciler";

import { mapFiber } from "@my-react-dom-shared";

import { clearFiberDom } from "./clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";

export const unmountFiber = (fiber: MyReactFiberNode) => {
  unmountFiberNode(fiber);

  clearFiberDom(fiber);
};

export const unmount = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.dispatch;

  const unmountMap = globalDispatch.unmountMap;

  const allUnmountFiber = unmountMap[fiber.uid] || [];

  unmountMap[fiber.uid] = [];

  if (allUnmountFiber.length) {
    mapFiber(allUnmountFiber as MyReactFiberNode | MyReactFiberNode[], (f) => unmountFiber(f));
  }
};