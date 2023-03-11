import type { MyReactFiberNode } from "@my-react/react";

export const mountLoop = (fiber: MyReactFiberNode) => {
  const queue = [fiber];
  const renderController = fiber.root.renderController;
  while (queue.length) {
    let length = queue.length;
    while (length > 0) {
      const current = queue.shift();
      const nextArray = renderController.performToNextArray(current);
      queue.push(...nextArray);
      length--;
    }
  }
};

export const mountLoopAsync = async (fiber: MyReactFiberNode) => {
  const queue = [fiber];
  const renderController = fiber.root.renderController;
  while (queue.length) {
    let length = queue.length;
    while (length > 0) {
      const current = queue.shift();
      const nextArray = await renderController.performToNextArrayAsync(current);
      queue.push(...nextArray);
      length--;
    }
  }
};
