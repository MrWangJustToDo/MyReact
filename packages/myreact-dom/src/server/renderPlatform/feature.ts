import { __my_react_internal__, __my_react_shared__ } from "@my-react/react";
import { processHookNode } from "@my-react/react-reconciler";

import { ServerDomPlatform } from "./instance";

import type { ClientDomPlatform } from "@my-react-dom-client/renderPlatform";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

const { enableDebugFiled } = __my_react_shared__;

/**
 * @internal
 */
export const initGlobalRenderPlatform = () => {
  const MyReactServerDomPlatform = new ServerDomPlatform(true);

  initRenderPlatform(MyReactServerDomPlatform);
};

/**
 * @internal
 */
export const prepareRenderPlatform = () => {
  let renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  if (!renderPlatform) initGlobalRenderPlatform();

  enableDebugFiled.current = false;

  renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  renderPlatform.isServer = true;

  renderPlatform.dispatchState = () => void 0;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = ({ error }) => {
    throw error;
  };
};
