import { MyReactFiberNode, unmountFiber } from "@my-react/react-reconciler";

import type { RenderContainer } from "@my-react-dom-client";

export const unmountComponentAtNode = (container: RenderContainer) => {
  const fiber = container.__fiber__;
  if (fiber instanceof MyReactFiberNode) {
    unmountFiber(fiber);
  }
};
