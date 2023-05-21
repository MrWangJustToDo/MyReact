import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { mountLoop, mountLoopAsync } from "../runtimeMount";
import { resetLogScope, safeCall, safeCallAsync, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const mount = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, hydrate?: boolean) => {
  globalLoop.current = true;

  enableScopeTreeLog.current && setLogScope();

  safeCall(() => mountLoop(fiber, renderDispatch));

  enableScopeTreeLog.current && resetLogScope();

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, hydrate?: boolean) => {
  globalLoop.current = true;

  enableScopeTreeLog.current && setLogScope();

  await safeCallAsync(() => mountLoopAsync(fiber, renderDispatch));

  enableScopeTreeLog.current && resetLogScope();

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  globalLoop.current = false;
};
