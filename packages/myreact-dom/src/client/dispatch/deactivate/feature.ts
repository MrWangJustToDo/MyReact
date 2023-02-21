import { deactivateList } from "./deactivate";

import type { MyReactFiberNode } from "@my-react/react";

export const deactivate = (fiber: MyReactFiberNode) => {
  const globalDispatch = fiber.root.globalDispatch;

  const deactivatedMap = globalDispatch.deactivatedMap;

  const allDeactivated = deactivatedMap[fiber.uid] || [];

  deactivatedMap[fiber.uid] = [];

  if (allDeactivated.length) allDeactivated.forEach(deactivateList);
};
