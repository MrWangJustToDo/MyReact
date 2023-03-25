import { __my_react_internal__ } from "@my-react/react";
import { unmountFiber } from "@my-react/react-reconciler";

import type { RenderContainer } from "@my-react-dom-client";

const { MyReactFiberNode: MyReactFiberNodeClass } = __my_react_internal__;

export const unmountComponentAtNode = (container: RenderContainer) => {
  const fiber = container.__fiber__;
  if (fiber instanceof MyReactFiberNodeClass) {
    unmountFiber(fiber);
  }
};
