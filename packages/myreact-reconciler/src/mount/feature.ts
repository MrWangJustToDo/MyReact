import { performToNextArray, performToNextArrayAsync } from "../generate";

import type { MyReactFiberNode } from "@my-react/react";

export const mountLoop = (fiber: MyReactFiberNode) => {
  const queue = [fiber];
  while (queue.length) {
    let length = queue.length;
    while (length > 0) {
      const current = queue.shift();
      const nextArray = performToNextArray(current);
      queue.push(...nextArray);
      length--;
    }
  }
};

export const mountLoopAsync = async (fiber: MyReactFiberNode) => {
  const queue = [fiber];
  while (queue.length) {
    let length = queue.length;
    while (length > 0) {
      const current = queue.shift();
      const nextArray = await performToNextArrayAsync(current);
      queue.push(...nextArray);
      length--;
    }
  }
};
