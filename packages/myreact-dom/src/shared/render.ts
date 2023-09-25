import { mount, mountAsync } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { ServerDomDispatch, LegacyServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

/**
 * @internal
 */
export const startRender = (fiber: MyReactFiberNode, renderDispatch: ClientDomDispatch | ServerDomDispatch | LegacyServerStreamDispatch, hydrate = false) => {
  const startTime = Date.now();

  mount(fiber, renderDispatch, hydrate);

  const endTime = Date.now();

  renderDispatch.isAppMounted = true;

  if (hydrate) {
    renderDispatch.hydrateTime = endTime - startTime;
  } else {
    renderDispatch.renderTime = endTime - startTime;
  }
};

/**
 * @internal
 */
export const startRenderAsync = async (
  fiber: MyReactFiberNode,
  renderDispatch: ClientDomDispatch | ServerDomDispatch | LegacyServerStreamDispatch,
  hydrate = false
) => {
  const startTime = Date.now();

  await mountAsync(fiber, renderDispatch, hydrate);

  renderDispatch.pendingCommitFiberList = null;

  renderDispatch.reconcileCommit(fiber, hydrate);

  const endTime = Date.now();

  renderDispatch.isAppMounted = true;

  if (hydrate) {
    renderDispatch.hydrateTime = endTime - startTime;
  } else {
    renderDispatch.renderTime = endTime - startTime;
  }
};
