import { mountSync, mountAsync } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomDispatch } from "@my-react-dom-client/renderDispatch";
import type { NoopLatestRenderDispatch, NoopLegacyRenderDispatch } from "@my-react-dom-noop/renderDispatch/instance";
import type { ServerDomDispatch, LegacyServerStreamDispatch, LatestServerStreamDispatch } from "@my-react-dom-server/renderDispatch";

/**
 * @internal
 */
export const startRender = (
  renderDispatch: ClientDomDispatch | ServerDomDispatch | LegacyServerStreamDispatch | NoopLegacyRenderDispatch,
  fiber: MyReactFiberNode,
  hydrate = false
) => {
  const startTime = Date.now();

  mountSync(renderDispatch, fiber);

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
  renderDispatch: ClientDomDispatch | ServerDomDispatch | LatestServerStreamDispatch | NoopLatestRenderDispatch,
  fiber: MyReactFiberNode,
  hydrate = false
) => {
  const startTime = Date.now();

  await mountAsync(renderDispatch, fiber);

  const endTime = Date.now();

  renderDispatch.isAppMounted = true;

  if (hydrate) {
    renderDispatch.hydrateTime = endTime - startTime;
  } else {
    renderDispatch.renderTime = endTime - startTime;
  }
};
