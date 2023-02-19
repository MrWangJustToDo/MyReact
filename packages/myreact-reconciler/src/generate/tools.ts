import { __my_react_shared__ } from "@my-react/react";

import type { MyReactFiberNodeDev } from "@my-react/react";

const { updateFiberNode, createFiberNode } = __my_react_shared__;

export const createFiberNodeDev = (...props: Parameters<typeof createFiberNode>) => {
  const fiber = createFiberNode(...props);

  const typedFiber = fiber as MyReactFiberNodeDev;

  const timeNow = Date.now();

  typedFiber._debugRenderState = {
    renderCount: 0,
    mountTime: timeNow,
    prevUpdateTime: timeNow,
    updateTimeStep: 0,
    currentUpdateTime: timeNow,
  };

  typedFiber._debugGlobalDispatch = typedFiber.root.globalDispatch;

  return fiber;
};

export const updateFiberNodeDev = (...props: Parameters<typeof updateFiberNode>) => {
  const fiber = updateFiberNode(...props);

  const typedFiber = fiber as MyReactFiberNodeDev;

  const prevState = typedFiber._debugRenderState || {
    renderCount: 0,
    mountTime: 0,
    prevUpdateTime: 0,
    updateTimeStep: 0,
    currentUpdateTime: 0,
  };

  const timeNow = Date.now();

  typedFiber._debugRenderState = {
    renderCount: prevState.renderCount + 1,
    mountTime: prevState.mountTime,
    prevUpdateTime: prevState.currentUpdateTime,
    updateTimeStep: timeNow - prevState.currentUpdateTime,
    currentUpdateTime: timeNow,
  };

  return fiber;
};
