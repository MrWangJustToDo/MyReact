import { MyReactFiberNode, triggerUnmount } from "@my-react/react-reconciler";

import { ClientDomDispatch, type RenderContainer } from "@my-react-dom-client";

export const unmountComponentAtNode = (container: RenderContainer) => {
  const fiber = container.__fiber__;

  const renderDispatch = container.__container__;

  if (!fiber || !renderDispatch || !(fiber instanceof MyReactFiberNode) || !(renderDispatch instanceof ClientDomDispatch)) {
    console.error(`[@my-react/react-dom] can not unmount app for current container`);
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
