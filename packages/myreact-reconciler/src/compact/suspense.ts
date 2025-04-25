import { nextWorkCommon } from "../runtimeGenerate";
import { WrapperBySuspenseScope } from "../runtimeScope";

import type { MyReactFiberNode } from "../runtimeFiber";

export const nextWorkSuspense = (fiber: MyReactFiberNode) => {
  const children = WrapperBySuspenseScope(fiber.pendingProps.children);

  nextWorkCommon(fiber, children);
};
