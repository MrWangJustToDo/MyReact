import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { processLazy } from "../processLazy";
import { mountLoop } from "../runtimeMount";
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

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  renderDispatch.reconcileCommit(fiber, hydrate);

  renderDispatch.isAppMounted = true;

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch, hydrate?: boolean) => {
  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoop(fiber, renderDispatch);

  let loopCount = 0;

  while (renderDispatch.pendingAsyncLoadFiberList?.length) {
    const beforeLength = renderDispatch.pendingAsyncLoadFiberList.length;

    const node = renderDispatch.pendingAsyncLoadFiberList.shift();

    await processLazy(node);

    mountLoop(node, renderDispatch);

    const afterLength = renderDispatch.pendingAsyncLoadFiberList.length;

    if (beforeLength === afterLength) {
      loopCount++;
      if (loopCount > 5) {
        throw new Error("lazy() load loop count is too much");
      }
    }
  }

  renderDispatch.pendingCommitFiberList = null;

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  renderDispatch.reconcileCommit(fiber, hydrate);

  renderDispatch.isAppMounted = true;

  globalLoop.current = false;
};
