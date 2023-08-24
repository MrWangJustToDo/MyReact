import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { processHookNode, processState, triggerError } from "@my-react/react-reconciler";

import { ClientDomPlatform } from "./instance";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ServerDomPlatform } from "@my-react-dom-server/renderPlatform";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled } = __my_react_shared__;

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
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

  renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  renderPlatform.isServer = false;

  renderPlatform.dispatchState = function (this: ClientDomPlatform, _params) {
    if (!this.isServer) {
      processState(_params);
    }
  };

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = function (this: ClientDomPlatform, _params) {
    if (this.isServer) {
      throw _params.error;
    } else {
      triggerError(_params.fiber as MyReactFiberNode, _params.error, () => {
        // 更新结束后触发error事件
        this.yieldTask(() => {
          window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
        });
      });
    }
  };
};
