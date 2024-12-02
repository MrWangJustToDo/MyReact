import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { fiberToDispatchMap, getFiberTree, processHookNode, enableFiberForLog, enableValidMyReactElement } from "@my-react/react-reconciler";

import { DomPlatform } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { LatestServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  enableFiberForLog.current = false;

  enableValidMyReactElement.current = false;

  const MyReactServerDomPlatform = new DomPlatform(true);

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

  return void 0;
};

/**
 * @internal
 */
export const prepareRenderPlatform = () => {
  let renderPlatform = currentRenderPlatform.current as DomPlatform

  if (!renderPlatform) initGlobalRenderPlatform();

  enableDebugFiled.current = false;

  enableScopeTreeLog.current = false;

  renderPlatform = currentRenderPlatform.current as DomPlatform;

  // if (__DEV__ && !renderPlatform.isServer) {
  //   console.warn(`[@my-react/react-dom] current environment is not server, please use 'render' instead of 'renderToString'`);
  // }

  renderPlatform.isServer = true;

  renderPlatform.dispatchState = () => void 0;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = dispatchError;
};
