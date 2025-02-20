import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { devErrorWithFiber, enableFiberForLog, enableValidMyReactElement, processHook, processState, triggerError } from "@my-react/react-reconciler";

import { DomPlatform, enableMoveBefore } from "@my-react-dom-shared";

import type { RenderHookParams, UpdateQueue } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

function dispatchState(this: DomPlatform, _params: UpdateQueue) {
  if (!this.isServer) {
    processState(_params);
  }
}

function dispatchHook(this: DomPlatform, _params: RenderHookParams) {
  return processHook(_params);
}

function dispatchError(this: DomPlatform, _params: { fiber: MyReactFiberNode; error: Error }) {
  if (!this.isServer) {
    if (__DEV__) devErrorWithFiber(_params.fiber, _params.error);
    if (_params.fiber) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const instance = this;
      triggerError(_params.fiber, _params.error, function triggerErrorOnFiberCallback() {
        // 更新结束后触发error事件
        instance.yieldTask(function dispatchErrorEvent() {
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

  enableValidMyReactElement.current = false;

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  enableMoveBefore.current = enableMoveBefore.current && typeof window !== "undefined" && typeof window?.Node?.prototype?.moveBefore === "function";

  renderPlatform = currentRenderPlatform.current as DomPlatform;

  // if (__DEV__ && renderPlatform.isServer) {
  //   console.warn(`[@my-react/react-dom] current environment is server, please use 'renderToString' instead of 'render'`);
  // }

  renderPlatform.isServer = false;

  renderPlatform.dispatchState = dispatchState;

  renderPlatform.dispatchHook = dispatchHook;

  renderPlatform.dispatchError = dispatchError;
};
