import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { mountLoopSync } from "@my-react/react-reconciler";

import { resetScopeLog, setScopeLog } from "./debug";
import { reconcileMount } from "./reconcileMount";

import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { safeCall, enableStrictLifeCycle } = __my_react_shared__;

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  setScopeLog();

  safeCall(() => mountLoopSync(fiber));

  reconcileMount(fiber, hydrate);

  if (__DEV__ && enableStrictLifeCycle.current) {
    console.warn("react-18 like lifecycle have been enabled!");
  }

  resetScopeLog();

  fiber.root.globalScope.isAppMounted = true;

  globalLoop.current = false;
};
