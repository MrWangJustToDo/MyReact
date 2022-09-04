import { __myreact_internal__ } from "@my-react/react";

import { unmountFiber } from "../client/dispatch/unmount";

import type { MyReactFiberNode } from "@my-react/react";

const { MyReactFiberNode: MyReactFiberNodeClass } = __myreact_internal__;

export const unmountComponentAtNode = (container: Element & { __fiber__: MyReactFiberNode }) => {
  const fiber = container.__fiber__;
  if (fiber instanceof MyReactFiberNodeClass) {
    unmountFiber(fiber);
  }
};
