import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { fiberToDispatchMap, getFiberTree, processHookNode, enableFiberForLog } from "@my-react/react-reconciler";

import { ServerDomPlatform } from "./instance";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomPlatform } from "@my-react-dom-client/renderPlatform";
import type { LatestServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  enableFiberForLog.current = false;

  const MyReactServerDomPlatform = new ServerDomPlatform(true);

  initRenderPlatform(MyReactServerDomPlatform);
};

const dispatchError = ({ fiber, error }: { fiber: MyReactFiberNode; error: Error }) => {
  const renderDispatch = fiberToDispatchMap.get(fiber);

  if (!renderDispatch) {
    throw error;
  }

  const typedRenderDispatch = renderDispatch as LatestServerStreamDispatch;

  if (typedRenderDispatch.onError) {
    typedRenderDispatch.onShellError?.(error);

    const tree = getFiberTree(fiber);

    typedRenderDispatch.onError(error, { componentStack: tree, digest: error.message });
  } else {
    throw error;
  }
};

/**
 * @internal
 */
export const prepareRenderPlatform = () => {
  let renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  if (!renderPlatform) initGlobalRenderPlatform();

  enableDebugFiled.current = false;

  enableScopeTreeLog.current = false;

  renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  renderPlatform.isServer = true;

  renderPlatform.dispatchState = () => void 0;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = dispatchError;
};
