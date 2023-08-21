import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { mountLoop, mountLoopAsync } from "../runtimeMount";
import { resetLogScope, setLogScope } from "../share";

import type { CustomRenderDispatch } from "../renderDispatch";
import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const mount = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, hydrate?: boolean) => {
  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoop(fiber, renderDispatch);

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, hydrate?: boolean) => {
  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  await mountLoopAsync(fiber, renderDispatch);

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  globalLoop.current = false;
};
