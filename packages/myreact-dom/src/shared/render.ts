import { mountAll, mountAllAsync } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react";

export const startRender = (fiber: MyReactFiberNode, hydrate = false) => {
  const startTime = Date.now();

  mountAll(fiber, hydrate);

  const endTime = Date.now();

  const renderScope = fiber.root.renderScope;

  renderScope.isAppMounted = true;

  if (hydrate) {
    renderScope.hydrateTime = endTime - startTime;
  } else {
    renderScope.renderTime = endTime - startTime;
  }
};

export const startRenderAsync = async (fiber: MyReactFiberNode, hydrate = false) => {
  const startTime = Date.now();

  await mountAllAsync(fiber, hydrate);

  const endTime = Date.now();

  const renderScope = fiber.root.renderScope;

  renderScope.isAppMounted = true;

  if (hydrate) {
    renderScope.hydrateTime = endTime - startTime;
  } else {
    renderScope.renderTime = endTime - startTime;
  }
};
