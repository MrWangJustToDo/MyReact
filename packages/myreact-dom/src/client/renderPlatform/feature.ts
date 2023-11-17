import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { devErrorWithFiber, enableFiberForLog, processHookNode, processState, triggerError } from "@my-react/react-reconciler";

import { ClientDomPlatform } from "./instance";

import type { UpdateQueue } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ServerDomPlatform } from "@my-react-dom-server/renderPlatform";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

function dispatchState(this: ClientDomPlatform, _params: UpdateQueue) {
  if (!this.isServer) {
    processState(_params);
  }
}

function dispatchError(this: ClientDomPlatform, _params: { fiber: MyReactFiberNode; error: Error }) {
  if (!this.isServer) {
    if (__DEV__) devErrorWithFiber(_params.fiber, _params.error);
    triggerError(_params.fiber, _params.error, () => {
      // 更新结束后触发error事件
      this.yieldTask(() => {
        window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
      });
    });
  }
}

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  enableFiberForLog.current = true;

  const MyReactServerDomPlatform = new ClientDomPlatform(true);

  initRenderPlatform(MyReactServerDomPlatform);
};

/**
 * @internal
 */
export const prepareRenderPlatform = () => {
  let renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  if (!renderPlatform) initGlobalRenderPlatform();

  enableDebugFiled.current = true;

  enableScopeTreeLog.current = true;

  renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  renderPlatform.isServer = false;

  renderPlatform.dispatchState = dispatchState;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = dispatchError;
};
