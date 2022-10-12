import { __my_react_shared__ } from "@my-react/react";

import type { MyReactFiberNodeDev} from "@my-react/react";

const { updateFiberNode: _updateFiberNode, createFiberNode: _createFiberNode } = __my_react_shared__;

export const createFiberNode = (...props: Parameters<typeof _createFiberNode>) => {
  const fiber = _createFiberNode(...props);

  if (__DEV__) {
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
  }

  return fiber;
};

export const updateFiberNode = (...props: Parameters<typeof _updateFiberNode>) => {
  const fiber = _updateFiberNode(...props);

  if (__DEV__) {
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
  }

  return fiber;
};
