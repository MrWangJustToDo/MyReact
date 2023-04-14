import { mount, mountAsync } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ClientDomContainer } from "@my-react-dom-client";


export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  const startTime = Date.now();

  mount(fiber, hydrate);

  const endTime = Date.now();

  const renderContainer = fiber.renderContainer as ClientDomContainer;

  renderContainer.isAppMounted = true;

  if (hydrate) {
    renderContainer.hydrateTime = endTime - startTime;
  } else {
    renderContainer.renderTime = endTime - startTime;
  }
};

export const startRenderAsync = async (fiber: MyReactFiberNode, hydrate = false) => {
  const startTime = Date.now();

  await mountAsync(fiber, hydrate);

  const endTime = Date.now();

  const renderContainer = fiber.renderContainer as ClientDomContainer;

  renderContainer.isAppMounted = true;

  if (hydrate) {
    renderContainer.hydrateTime = endTime - startTime;
  } else {
    renderContainer.renderTime = endTime - startTime;
  }
};
