import { STATE_TYPE, exclude } from "@my-react/react-shared";

import type { MyReactFiberNode, MyReactFiberContainer } from "@my-react/react-reconciler";

/**
 * @internal
 */
export const getFiberWithNativeDom = (fiber: MyReactFiberNode | null, transform: (f: MyReactFiberNode) => MyReactFiberNode | null): MyReactFiberNode | null => {
  if (fiber) {
    const maybeContainer = fiber as MyReactFiberContainer;

    if (fiber.nativeNode && exclude(fiber.state, STATE_TYPE.__unmount__)) return fiber;

    if (maybeContainer.containerNode && exclude(maybeContainer.state, STATE_TYPE.__unmount__)) return fiber;

    return getFiberWithNativeDom(transform(fiber), transform);
  }
  return null;
};
