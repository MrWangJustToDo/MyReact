import type { MyReactFiberNode } from "./instance";

export const checkIsMyReactFiberNode = (fiber: unknown): fiber is MyReactFiberNode => {
  return (
    fiber &&
    typeof fiber === "object" &&
    fiber.constructor &&
    fiber.constructor.prototype &&
    Object.prototype.hasOwnProperty.call(fiber.constructor.prototype, "isMyReactFiberNode") &&
    fiber.constructor.prototype.isMyReactFiberNode
  );
};
