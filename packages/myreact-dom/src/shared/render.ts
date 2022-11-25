import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { mountLoopSync, mountLoopSyncAwait } from "@my-react/react-reconciler";

import { resetScopeLog, safeCall, setScopeLog } from "./debug";
import { reconcileMount } from "./reconcileMount";

import type { DomScope } from "./scope";
import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableStrictLifeCycle } = __my_react_shared__;

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  const startTime = Date.now();

  setScopeLog();

  safeCall(() => mountLoopSync(fiber));

  reconcileMount(fiber, hydrate);

  if (__DEV__ && enableStrictLifeCycle.current) {
    console.warn("react-18 like lifecycle have been enabled!");
  }

  resetScopeLog();

  const endTime = Date.now();

  const globalScope = fiber.root.globalScope as DomScope;

  globalScope.isAppMounted = true;

  if (__DEV__) {
    if (hydrate) {
      globalScope.hydrateTime = endTime - startTime;
    } else {
      globalScope.renderTime = endTime - startTime;
    }
  }

  globalLoop.current = false;
};

export const startRenderAsync = async (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  const startTime = Date.now();

  setScopeLog();

  await safeCall(async () => await mountLoopSyncAwait(fiber));

  reconcileMount(fiber, hydrate);

  if (__DEV__ && enableStrictLifeCycle.current) {
    console.warn("react-18 like lifecycle have been enabled!");
  }

  resetScopeLog();

  const endTime = Date.now();

  const globalScope = fiber.root.globalScope as DomScope;

  globalScope.isAppMounted = true;

  if (__DEV__) {
    if (hydrate) {
      globalScope.hydrateTime = endTime - startTime;
    } else {
      globalScope.renderTime = endTime - startTime;
    }
  }

  globalLoop.current = false;
};
