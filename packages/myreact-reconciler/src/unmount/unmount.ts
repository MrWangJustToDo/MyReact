import { generateFiberToList } from "../share";

import type { MyReactFiberNode } from "@my-react/react";

export const unmountFiberNode = (fiber?: MyReactFiberNode) => {
  if (!fiber) return;
  // unmountFiberNode(fiber.child);
  // fiber.unmount();
  // fiber.root.dispatch.removeFiber(fiber);
  // unmountFiberNode(fiber.sibling);

  // loop
  const dispatch = fiber.root.dispatch;
  const listTree = generateFiberToList(fiber);
  listTree.listToHead((f) => {
    f.unmount();
    dispatch.removeFiber(f);
  });
};
