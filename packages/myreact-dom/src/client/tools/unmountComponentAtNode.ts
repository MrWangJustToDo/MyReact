import { MyReactFiberNode, triggerUnmount } from "@my-react/react-reconciler";

import { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import { log } from "@my-react-dom-shared";

import type { RenderContainer } from "@my-react-dom-client/mount";

export const unmountComponentAtNode = (container: RenderContainer) => {
  const fiber = container.__fiber__;

  const renderDispatch = container.__container__;

  if (!fiber || !renderDispatch || !(fiber instanceof MyReactFiberNode) || !(renderDispatch instanceof ClientDomDispatch)) {
    log(fiber, "error", `can not unmount app for current container`);
    return;
  }

  triggerUnmount(fiber, () => {
    renderDispatch.pendingUpdateFiberArray.clear();
    renderDispatch.runtimeFiber.scheduledFiber = null;
    renderDispatch.runtimeFiber.nextWorkingFiber = null;
    renderDispatch.isAppMounted = false;
    renderDispatch.isAppUnmounted = true;
  });
};
