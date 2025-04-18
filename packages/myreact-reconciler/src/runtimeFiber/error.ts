import { unmountFiber } from "../renderUnmount";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "./instance";

export const switchErrorState = (_fiber: MyReactFiberNode, _renderDispatch: CustomRenderDispatch) => {
  let child = _fiber.child;

  while (child) {
    unmountFiber(child);

    child = child.sibling;
  }
};
