import { NODE_TYPE } from "@my-react/react-reconciler";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { loadLazy } from "@my-react-dom-client/renderDispatch";

import type { lazy } from "@my-react/react";
import type { MyReactFiberNode} from "@my-react/react-reconciler";

export const serverProcessFiber = async (fiber: MyReactFiberNode) => {
  if (include(fiber.type, NODE_TYPE.__lazy__)) {
    await loadLazy(fiber, fiber.elementType as ReturnType<typeof lazy>);
  }

  fiber.state = STATE_TYPE.__reschedule__;
}