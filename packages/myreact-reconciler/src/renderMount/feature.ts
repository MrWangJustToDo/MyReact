import { __my_react_internal__ } from "@my-react/react";

import { mountLoop, mountLoopAsync } from "../runtimeMount";
import { safeCall, safeCallAsync } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

export const mount = (fiber: MyReactFiberNode, hydrate?: boolean) => {
  const renderContainer = fiber.container;

  const renderDispatch = renderContainer.renderDispatch;

  globalLoop.current = true;

  safeCall(() => mountLoop(fiber));

  renderContainer.commitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, hydrate?: boolean) => {
  const renderContainer = fiber.container;

  const renderDispatch = renderContainer.renderDispatch;

  globalLoop.current = true;

  await safeCallAsync(() => mountLoopAsync(fiber));

  renderContainer.commitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};
