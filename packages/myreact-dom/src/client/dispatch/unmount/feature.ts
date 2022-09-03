import { __myreact_shared__ } from "@my-react/react";

import { mapFiber } from "@ReactDOM_shared";

import { clearFiberDom } from "./clearFiberDom";

import type { MyReactFiberNode } from "@my-react/react";

export const _unmount = (fiber: MyReactFiberNode) => {
  __myreact_shared__.unmountFiber(fiber);
  clearFiberDom(fiber);
};

export const unmount = (fiber: MyReactFiberNode) => {
  const allUnmountFiber = fiber.__unmountQueue__.slice(0);

  if (allUnmountFiber.length) {
    mapFiber(allUnmountFiber as MyReactFiberNode | MyReactFiberNode[], (f) => _unmount(f));
  }

  fiber.__unmountQueue__ = [];
};
