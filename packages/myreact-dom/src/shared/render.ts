import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { mountLoop, mountLoopAsync } from "@my-react/react-reconciler";

import { resetScopeLog, safeCall, safeCallAsync, setScopeLog } from "./debug";
import { reconcileMount } from "./reconcileMount";

import type { MyReactFiberNode } from "@my-react/react";

const { globalLoop } = __my_react_internal__;

const { enableStrictLifeCycle, enableLegacyLifeCycle } = __my_react_shared__;

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  const startTime = Date.now();

  if (__DEV__) {
    setScopeLog();
  }

  safeCall(() => mountLoop(fiber));

  reconcileMount(fiber, hydrate);

  if (__DEV__ && enableStrictLifeCycle.current) {
    console.warn("react-18 like lifecycle have been enabled!");
  }

  if (__DEV__ && enableLegacyLifeCycle.current) {
    console.warn("legacy lifeCycle have been enabled!");
  }

  if (__DEV__) {
    resetScopeLog();
  }

  const endTime = Date.now();

  const renderScope = fiber.root.renderScope;

  renderScope.isAppMounted = true;

  if (hydrate) {
    renderScope.hydrateTime = endTime - startTime;
  } else {
    renderScope.renderTime = endTime - startTime;
  }

  globalLoop.current = false;
};

export const startRenderAsync = async (fiber: MyReactFiberNode, hydrate = false) => {
  globalLoop.current = true;

  const startTime = Date.now();

  if (__DEV__) {
    setScopeLog();
  }

  await safeCallAsync(() => mountLoopAsync(fiber));

  reconcileMount(fiber, hydrate);

  if (__DEV__ && enableStrictLifeCycle.current) {
    console.warn("react-18 like lifecycle have been enabled!");
  }

  if (__DEV__ && enableLegacyLifeCycle.current) {
    console.warn("legacy lifeCycle have been enabled!");
  }

  if (__DEV__) {
    resetScopeLog();
  }

  const endTime = Date.now();

  const renderScope = fiber.root.renderScope;

  renderScope.isAppMounted = true;

  if (hydrate) {
    renderScope.hydrateTime = endTime - startTime;
  } else {
    renderScope.renderTime = endTime - startTime;
  }

  globalLoop.current = false;
};
