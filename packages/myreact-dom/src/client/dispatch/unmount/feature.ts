import { __my_react_shared__ } from "@my-react/react";

import { mapFiber } from "@my-react-dom-shared";

import { clearFiberDom } from "./clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";

const { unmountFiberNode } = __my_react_shared__;

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
