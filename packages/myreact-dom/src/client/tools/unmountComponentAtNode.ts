import { __my_react_internal__ } from "@my-react/react";
import { MyReactFiberNode, unmountContainer } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { delGlobalDispatch, log } from "@my-react-dom-shared";

import type { RenderContainer } from "@my-react-dom-client/mount";

const { currentScheduler } = __my_react_internal__;

export const unmountComponentAtNode = (container: RenderContainer) => {
  const renderDispatch = container.__container__;

  const fiber = renderDispatch?.rootFiber;

  const renderScheduler = currentScheduler.current;

  if (!fiber || !renderDispatch || !(fiber instanceof MyReactFiberNode) || !(renderDispatch instanceof ClientDomDispatch)) {
    fiber ? log(fiber, "error", `can not unmount app for current container`) : console.error(`can not unmount app for current container`);
    return;
  }

  delGlobalDispatch(renderDispatch);

  unmountContainer(renderDispatch, function afterUnmountContainer() {
    renderScheduler.dispatchSet?.uniDelete?.(renderDispatch);

    delete container.__container__;
  });
};
