import { __my_react_internal__ } from "@my-react/react";
import { MyReactFiberNode, unmountContainer } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { log } from "@my-react-dom-shared";

import type { CustomRenderPlatform } from "@my-react/react-reconciler";
import type { RenderContainer } from "@my-react-dom-client/mount";

const { currentRenderPlatform } = __my_react_internal__;

export const unmountComponentAtNode = (container: RenderContainer) => {
  const fiber = container.__fiber__;

  const renderDispatch = container.__container__;

  const renderPlatform = currentRenderPlatform.current as CustomRenderPlatform;

  if (!fiber || !renderDispatch || !(fiber instanceof MyReactFiberNode) || !(renderDispatch instanceof ClientDomDispatch)) {
    log(fiber, "error", `can not unmount app for current container`);
    return;
  }

  unmountContainer(renderDispatch, () => renderPlatform.dispatchSet?.uniDelete?.(renderDispatch));
};
