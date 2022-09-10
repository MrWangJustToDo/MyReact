import { globalDispatch } from "../share";

import type { MyReactFiberNode } from "./instance";

export const unmountFiberNode = (fiber: MyReactFiberNode) => {
  fiber.children.forEach(unmountFiberNode);
  fiber.unmount();
  globalDispatch.current.removeFiber(fiber);
};
