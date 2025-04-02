import { include, STATE_TYPE } from "@my-react/react-shared";

import { CustomRenderDispatch } from "../renderDispatch";
import { mountSync } from "../renderMount";
import { unmountContainer } from "../renderUnmount";
import { initialFiberNode, MyReactFiberNode, triggerUpdateOnFiber } from "../runtimeFiber";
import { checkIsSameType, safeCallWithSync } from "../share";

import { createDispatch } from "./dispatch";
import { prepareRenderPlatform } from "./platform";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberRoot } from "../runtimeFiber";
import type { MyReactElementNode } from "@my-react/react";

export type RenderContainer = Record<string, any> & {
  __fiber__: MyReactFiberNode;
  __container__: ReconcilerDispatch;
};

// react-reconciler compact implementation
export const Reconciler = (_config: any) => {
  const createContainer = (_container: RenderContainer) => {
    prepareRenderPlatform();
  };

  const updateContainer = (_element: MyReactElementNode, _container: RenderContainer, _ignore: any, _cb: () => void) => {
    const renderDispatch = _container.__container__;

    if (renderDispatch instanceof CustomRenderDispatch) {
      const _fiber = _container.__fiber__;

      if (renderDispatch.isAppCrashed || include(_fiber.state, STATE_TYPE.__unmount__)) {
        // is there are not a valid render tree, try do the pure rerender
        _container.__fiber__ = null;

        _container.__container__ = null;

        updateContainer(_element, _container, _config, _cb);

        return;
      }
      if (checkIsSameType(_fiber, _element)) {
        _fiber._installElement(_element);

        triggerUpdateOnFiber(_fiber, STATE_TYPE.__triggerSync__, _cb);

        return;
      }

      unmountContainer(renderDispatch)
    }
    const _fiber = new MyReactFiberNode(_element) as MyReactFiberRoot;

    const _renderDispatch = createDispatch(_container, _fiber, _config);

    _cb && _renderDispatch.pendingEffect(_fiber, _cb);

    _container.__fiber__ = _fiber;

    _container.__container__ = _renderDispatch;

    initialFiberNode(_fiber, _renderDispatch);

    mountSync(_fiber, _renderDispatch);

    _renderDispatch.isAppMounted = true;
  };

  const injectIntoDevTools = (_config: any) => {};

  return {
    createContainer,
    updateContainer,
    injectIntoDevTools,
    flushSync: safeCallWithSync,
  };
};
