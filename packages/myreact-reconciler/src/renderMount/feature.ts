import { __my_react_internal__ } from "@my-react/react";

import { mountLoop, mountLoopAsync } from "../runtimeMount";
import { resetLogScope, safeCall, safeCallAsync, setLogScope } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

export const mount = (fiber: MyReactFiberNode, hydrate?: boolean) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  globalLoop.current = true;

  setLogScope();

  safeCall(() => mountLoop(fiber));

  resetLogScope();

  renderContainer.commitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, hydrate?: boolean) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  globalLoop.current = true;

  setLogScope();

  await safeCallAsync(() => mountLoopAsync(fiber));

  resetLogScope();

  renderContainer.commitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};
