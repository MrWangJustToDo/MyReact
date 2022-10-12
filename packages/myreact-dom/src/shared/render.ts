import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { mountLoopSync } from "@my-react/react-reconciler";

import { reconcileMount } from "./reconcileMount";

import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { safeCall } = __my_react_shared__;

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  safeCall(() => mountLoopSync(fiber));

  reconcileMount(fiber, hydrate);

  fiber.root.globalScope.isAppMounted = true;

  globalLoop.current = false;
};
