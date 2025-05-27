import { __my_react_internal__, __my_react_shared__, type MyReactElementNode } from "@my-react/react";
import {
  MyReactFiberNode,
  CustomRenderDispatch,
  // enableFiberForLog,
  checkIsSameType,
  triggerUpdateOnFiber,
  unmountContainer,
  initialFiberNode,
  mountSync,
  safeCallWithSync,
} from "@my-react/react-reconciler";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { autoSetDevTools, delGlobalDispatch } from "./devtool";
import { createDispatch } from "./dispatch";
import { loadScript } from "./polyfill";
import { prepareScheduler } from "./scheduler";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberRoot } from "@my-react/react-reconciler";

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

const { currentScheduler } = __my_react_internal__;

export type RenderContainer = Record<string, any> & {
  __fiber__: MyReactFiberNode;
  __container__: ReconcilerDispatch;
};

// react-reconciler compact implementation
export const Reconciler = (_config: any) => {
  let rendererPackageName = "@my-react";

  const ReconcilerSet = new Set<CustomRenderDispatch>();

  const createContainer = (_container: RenderContainer) => {
    prepareScheduler();

    enableDebugFiled.current = __DEV__;

    enableScopeTreeLog.current = false;

    // enableFiberForLog.current = false;

    return _container;
  };

  const updateContainer = (_element: MyReactElementNode, _container: RenderContainer, _ignore: any, _cb: () => void) => {
    const renderDispatch = _container.__container__;

    const renderScheduler = currentScheduler.current;

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

      unmountContainer(renderDispatch);

      ReconcilerSet.delete(renderDispatch);

      renderScheduler.dispatchSet.uniDelete(renderDispatch);

      delGlobalDispatch(renderDispatch);
    }
    const _fiber = new MyReactFiberNode(_element) as MyReactFiberRoot;

    const _renderDispatch = createDispatch(_container, _fiber, _element, _config);

    _cb && _renderDispatch.pendingEffect(_fiber, _cb);

    ReconcilerSet.add(_renderDispatch);

    renderScheduler.dispatchSet.uniPush(_renderDispatch);

    _renderDispatch.renderPackage = rendererPackageName;

    _container.__fiber__ = _fiber;

    _container.__container__ = _renderDispatch;

    autoSetDevTools(_renderDispatch);

    initialFiberNode(_fiber, _renderDispatch);

    mountSync(_fiber, _renderDispatch);

    _renderDispatch.isAppMounted = true;
  };

  const injectIntoDevTools = async (_config: any) => {
    rendererPackageName = _config.rendererPackageName || rendererPackageName;

    ReconcilerSet.forEach((renderDispatch) => (renderDispatch.renderPackage = rendererPackageName));

    if (globalThis["__MY_REACT_DEVTOOL_INTERNAL__"]) return;

    // load core runtime
    // await loadScript("https://mrwangjusttodo.github.io/myreact-devtools/bundle/hook.js");
    await loadScript("https://mrwangjusttodo.github.io/myreact-devtools/bundle/hook.js");
    // connect to devtools, current need run https://github.com/MrWangJustToDo/myreact-devtools with pnpm run dev:web command
  };

  const injectIntoDevToolsWithSocketIO = async (url: string, _config: any) => {
    // load core runtime
    await injectIntoDevTools(_config || {});
    // start, see https://github.com/MrWangJustToDo/myreact-devtools/blob/main/packages/bridge/src/hook.ts
    const init = globalThis["__MY_REACT_DEVTOOL_NODE__"];

    try {
      await init(url);
    } catch {
      // ignore error
    }
  };

  return {
    createContainer,
    updateContainer,
    injectIntoDevTools,
    injectIntoDevToolsWithSocketIO,
    flushSync: safeCallWithSync,
    batchedUpdates: safeCallWithSync,
  };
};
