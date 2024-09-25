import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { devErrorWithFiber, enableFiberForLog, processHookNode, processState, triggerError } from "@my-react/react-reconciler";

import { DomPlatform } from "@my-react-dom-shared";

import type { UpdateQueue } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

function dispatchState(this: DomPlatform, _params: UpdateQueue) {
  if (!this.isServer) {
    processState(_params);
  }
}

function dispatchError(this: DomPlatform, _params: { fiber: MyReactFiberNode; error: Error }) {
  if (!this.isServer) {
    if (__DEV__) devErrorWithFiber(_params.fiber, _params.error);
    if (_params.fiber) {
      triggerError(_params.fiber, _params.error, function triggerErrorOnFiberCallback() {
        // 更新结束后触发error事件
        this.yieldTask(function dispatchErrorEvent() {
          window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
        });
      });
    } else {
      this.yieldTask(function dispatchErrorEvent() {
        window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
      });
    }
  }
  return void 0;
}

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  enableFiberForLog.current = true;

  const MyReactServerDomPlatform = new DomPlatform(false);

  initRenderPlatform(MyReactServerDomPlatform);
};

/**
 * @internal
 */
export const prepareRenderPlatform = () => {
  let renderPlatform = currentRenderPlatform.current as DomPlatform;

  if (!renderPlatform) initGlobalRenderPlatform();

  enableDebugFiled.current = true;

  enableScopeTreeLog.current = true;

  renderPlatform = currentRenderPlatform.current as DomPlatform;

  // if (__DEV__ && renderPlatform.isServer) {
  //   console.warn(`[@my-react/react-dom] current environment is server, please use 'renderToString' instead of 'render'`);
  // }

  renderPlatform.isServer = false;

  renderPlatform.dispatchState = dispatchState;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = dispatchError;
};
