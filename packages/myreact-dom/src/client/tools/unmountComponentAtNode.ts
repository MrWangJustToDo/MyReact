import { __my_react_internal__ } from "@my-react/react";
import { MyReactFiberNode, unmountContainer } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { delGlobalDispatch, log } from "@my-react-dom-shared";

import type { CustomRenderPlatform } from "@my-react/react-reconciler";
import type { RenderContainer } from "@my-react-dom-client/mount";

const { currentRenderPlatform } = __my_react_internal__;

export const unmountComponentAtNode = (container: RenderContainer) => {
  const renderDispatch = container.__container__;

  const fiber = renderDispatch.rootFiber;

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  if (!fiber || !renderDispatch || !(fiber instanceof MyReactFiberNode) || !(renderDispatch instanceof ClientDomDispatch)) {
    log(fiber, "error", `can not unmount app for current container`);
    return;
  }

  delGlobalDispatch(renderDispatch);

  unmountContainer(renderDispatch, () => renderPlatform.dispatchSet?.uniDelete?.(renderDispatch));
};
