import { __my_react_internal__ } from "@my-react/react";

import { unmountFiber } from "@my-react-dom-client/dispatch/unmount";

import type { DomNode } from "./dom";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

export const unmountComponentAtNode = (container: DomNode) => {
  const fiber = container.__fiber__;
  if (fiber instanceof MyReactFiberNodeClass) {
    unmountFiber(fiber);
  }
};
