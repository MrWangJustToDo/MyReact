import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { processHookNode, enableFiberForLog } from "@my-react/react-reconciler";

import { DomPlatform } from "@my-react-dom-shared";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  enableFiberForLog.current = false;

  const MyReactNoopDomPlatform = new DomPlatform(true);

  initRenderPlatform(MyReactNoopDomPlatform);
};

const dispatchError = ({ error }: { fiber: MyReactFiberNode; error: Error }) => {
  throw error
};

/**
 * @internal
 */
export const beforeNoopRender = () => {
  initGlobalRenderPlatform();

  enableDebugFiled.current = false;

  enableScopeTreeLog.current = false;

  const renderPlatform = currentRenderPlatform.current as DomPlatform;

  renderPlatform.dispatchState = () => void 0;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = dispatchError;
};
