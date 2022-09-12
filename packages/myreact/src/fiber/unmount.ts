import type { MyReactFiberNode } from "./instance";

export const unmountFiberNode = (fiber: MyReactFiberNode) => {
  fiber.children.forEach(unmountFiberNode);
  fiber.unmount();
  fiber.root.dispatch.removeFiber(fiber);
};
