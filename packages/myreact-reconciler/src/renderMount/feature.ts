import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";

import { processLazy } from "../processLazy";
import { listenerMap, type CustomRenderDispatch } from "../renderDispatch";
import { mountLoop } from "../runtimeMount";
import { resetLogScope, safeCallWithCurrentFiber, setLogScope } from "../share";

import type { MyReactFiberNode } from "../runtimeFiber";

const { globalLoop } = __my_react_internal__;

const { enableScopeTreeLog } = __my_react_shared__;

export const mount = (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
  globalLoop.current = true;

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  mountLoop(fiber, renderDispatch);

  __DEV__ && enableScopeTreeLog.current && resetLogScope();

  (function finishMount() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    renderDispatch.reconcileCommit(fiber);

    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    __DEV__ && enableScopeTreeLog.current && resetLogScope();

    changedList?.length &&
      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        },
      });
  })();

  globalLoop.current = false;
};

export const mountAsync = async (fiber: MyReactFiberNode, renderDispatch: CustomRenderDispatch) => {
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

  __DEV__ && enableScopeTreeLog.current && setLogScope();

  (function finishMount() {
    __DEV__ && enableScopeTreeLog.current && setLogScope();

    renderDispatch.reconcileCommit(fiber);

    const commitList = renderDispatch.pendingCommitFiberList;

    const changedList = renderDispatch.pendingChangedFiberList;

    renderDispatch.resetUpdateFlowRuntimeFiber();

    renderDispatch.pendingCommitFiberList = null;

    renderDispatch.pendingChangedFiberList = null;

    commitList?.length && renderDispatch.reconcileUpdate(commitList);

    __DEV__ && enableScopeTreeLog.current && setLogScope();

    changedList?.length &&
      safeCallWithCurrentFiber({
        fiber,
        action: function safeCallFiberHasChangeListener() {
          listenerMap.get(renderDispatch)?.fiberHasChange?.forEach((cb) => cb(changedList));
        },
      });
  })();

  globalLoop.current = false;
};
