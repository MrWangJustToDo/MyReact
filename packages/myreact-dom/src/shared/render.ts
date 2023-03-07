import { __my_react_shared__ } from "@my-react/react";
import { mountAll, mountAllAsync } from "@my-react/react-reconciler";

import { resetScopeLog, setScopeLog } from "./debug";

import type { MyReactFiberNode } from "@my-react/react";

const { enableStrictLifeCycle, enableLegacyLifeCycle } = __my_react_shared__;

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  const startTime = Date.now();

  if (__DEV__) {
    setScopeLog();
  }

  mountAll(fiber, hydrate);

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
};

export const startRenderAsync = async (fiber: MyReactFiberNode, hydrate = false) => {
  const startTime = Date.now();

  if (__DEV__) {
    setScopeLog();
  }

  await mountAllAsync(fiber, hydrate);

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
};
