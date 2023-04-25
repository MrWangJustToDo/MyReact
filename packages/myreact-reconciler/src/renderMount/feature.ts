import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { mountLoop, mountLoopAsync } from "../runtimeMount";
import { resetLogScope, safeCall, safeCallAsync, setLogScope } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const mount = (fiber: MyReactFiberNode, hydrate?: boolean) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  globalLoop.current = true;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => mountLoop(fiber));

  enableScopeTreeLog.current && resetLogScope();

  renderContainer.commitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, hydrate?: boolean) => {
  const renderContainer = fiber.renderContainer;

  const renderDispatch = renderContainer.renderDispatch;

  globalLoop.current = true;

  enableScopeTreeLog.current && setLogScope();

  await safeCallAsync(() => mountLoopAsync(fiber));

  enableScopeTreeLog.current && resetLogScope();

  renderContainer.commitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};
