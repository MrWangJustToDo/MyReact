import { __my_react_internal__ } from "@my-react/react";
import { processHookNode } from "@my-react/react-reconciler";

import { ServerDomPlatform } from "./instance";

import type { ClientDomPlatform } from "@my-react-dom-client/renderPlatform";

const { initRenderPlatform, currentRenderPlatform } = __my_react_internal__;

export const initGlobalRenderPlatform = () => {
  const MyReactServerDomPlatform = new ServerDomPlatform(true);

  initRenderPlatform(MyReactServerDomPlatform);
};

export const prepareRenderPlatform = () => {
  let renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  if (!renderPlatform) initGlobalRenderPlatform();

  renderPlatform = currentRenderPlatform.current as ClientDomPlatform | ServerDomPlatform;

  renderPlatform.isServer = true;

  renderPlatform.dispatchState = () => void 0;

  renderPlatform.dispatchHook = processHookNode;

  renderPlatform.dispatchError = ({ error }) => {
    throw error;
  };
};
