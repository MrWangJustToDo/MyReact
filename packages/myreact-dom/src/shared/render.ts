import { __myreact_internal__, __myreact_shared__ } from "@my-react/react";
import { mountLoopSync } from "@my-react/react-reconciler";

import { reconcileMount } from "./reconcileMount";

import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop, isAppMounted } = __myreact_internal__;

const { safeCall } = __myreact_shared__;

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  safeCall(() => mountLoopSync(fiber));

  reconcileMount(fiber, hydrate);

  isAppMounted.current = true;

  globalLoop.current = false;
};
