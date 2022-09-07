import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { mapFiber } from "@ReactDOM_shared";

import { clearFiberDom } from "./clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";

export const unmountFiber = (fiber: MyReactFiberNode) => {
  __my_react_shared__.unmountFiberNode(fiber);
  clearFiberDom(fiber);
};

const { globalDispatch } = __my_react_internal__;

export const unmount = (fiber: MyReactFiberNode) => {
  const unmountMap = globalDispatch.current.unmountMap;

  const allUnmountFiber = unmountMap[fiber.uid] || [];

  unmountMap[fiber.uid] = [];

  if (allUnmountFiber.length) {
    mapFiber(allUnmountFiber as MyReactFiberNode | MyReactFiberNode[], (f) => unmountFiber(f));
  }
};
