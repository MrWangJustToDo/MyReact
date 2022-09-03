import type { MyReactFiberNode } from "./instance";

export const unmountFiber = (fiber: MyReactFiberNode) => {
  fiber.children.forEach(unmountFiber);
  fiber.unmount();
};
