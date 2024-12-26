import { NODE_TYPE, type MyReactFiberNode } from "@my-react/react-reconciler";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { loadLazy } from "@my-react-dom-client/renderDispatch";

import type { lazy } from "@my-react/react";

export const noopProcessFiber = async (_fiber: MyReactFiberNode) => {
  if (include(_fiber.type, NODE_TYPE.__lazy__)) {
    await loadLazy(_fiber, _fiber.elementType as ReturnType<typeof lazy>);
  }

  _fiber.state = STATE_TYPE.__reschedule__;
}