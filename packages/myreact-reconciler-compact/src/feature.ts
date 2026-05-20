import { __my_react_internal__, __my_react_shared__, type MyReactElementNode } from "@my-react/react/type";
import {
  MyReactFiberNode,
  CustomRenderDispatch,
  enableFiberForLog,
  checkIsSameType,
  triggerUpdateOnFiber,
  unmountContainer,
  initialFiberNode,
  mountSync,
  safeCallWithSync,
  enableDebugUpdateQueue,
  beforeSyncUpdate,
  afterSyncUpdate,
  flushEffectCallback,
  getInstanceOwnerFiber,
} from "@my-react/react-reconciler";
import { include, STATE_TYPE } from "@my-react/react-shared";

import { enableKnownConfigLog, knownConfig } from "./config";
import { autoSetDevTools, delGlobalDispatch } from "./devtool";
import { createDispatch } from "./dispatch";
import { autoSetDevHMR } from "./hmr";
import { createPortal } from "./portal";
import { prepareScheduler } from "./scheduler";

import type { ReconcilerDispatch } from "./dispatch";
import type { MyReactFiberRoot } from "@my-react/react-reconciler";

const { enableDebugFiled, enableScopeTreeLog } = __my_react_shared__;

const { currentScheduler } = __my_react_internal__;

export type RenderContainer = Record<string, any> & {
  __flag__: number;
  __fiber__: MyReactFiberNode;
  __container__: ReconcilerDispatch;
};

// react-reconciler compat implementation
export const Reconciler = (_config: any) => {
  let rendererPackageName = "@my-react";

  let isRendering = false;

  const ReconcilerSet = new Set<CustomRenderDispatch>();

  if (__DEV__ && enableKnownConfigLog.current) {
    knownConfig(_config);
  }

  const createContainer = (_container: RenderContainer, flag: number) => {
    prepareScheduler();

    if (flag === 0) {
      _container.__flag__ = 0;
    } else {
      _container.__flag__ = 1;
    }

    enableDebugFiled.current = __DEV__;

    enableDebugUpdateQueue.current = __DEV__;

    enableScopeTreeLog.current = false;

    enableFiberForLog.current = false;

    return _container;
  };

  const createHydrationContainer = (
    _initialChildren: MyReactElementNode,
    _callback: (() => void) | null | undefined,
    _container: RenderContainer,
    flag: number,
    _hydrationCallbacks: any,
    _isStrictMode: boolean,
    _concurrentUpdatesByDefaultOverride: boolean | null,
    _identifierPrefix: string,
    _onRecoverableError: (error: Error) => void,
    _transitionCallbacks: any
  ) => {
    const opaqueRoot = createContainer(_container, flag);

    updateContainer(_initialChildren, opaqueRoot, null, _callback ?? (() => {}));

    return opaqueRoot;
  };

  const updateContainer = (_element: MyReactElementNode, _container: RenderContainer, _ignore: any, _cb: () => void) => {
    const renderDispatch = _container.__container__;

    const renderScheduler = currentScheduler.current;

    isRendering = true;

    try {
      if (renderDispatch instanceof CustomRenderDispatch) {
        const _fiber = _container.__fiber__;

        if (renderDispatch.isAppCrashed || include(_fiber.state, STATE_TYPE.__unmount__)) {
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

        _config?.clearContainer?.(_container);

        ReconcilerSet.delete(renderDispatch);

        renderScheduler.dispatchSet.uniDelete(renderDispatch);

        delGlobalDispatch(renderDispatch);
      }
      const _fiber = new MyReactFiberNode(_element) as MyReactFiberRoot;

      const _renderDispatch = createDispatch(_container, _fiber, _element, _config, _container.__flag__);

      _cb && _renderDispatch.pendingEffect(_fiber, _cb);

      ReconcilerSet.add(_renderDispatch);

      renderScheduler.dispatchSet.uniPush(_renderDispatch);

      _renderDispatch.renderPackage = rendererPackageName;

      _container.__fiber__ = _fiber;

      _container.__container__ = _renderDispatch;

      autoSetDevTools(_renderDispatch);

      autoSetDevHMR(_renderDispatch);

      initialFiberNode(_renderDispatch, _fiber);

      mountSync(_renderDispatch, _fiber);

      _renderDispatch.isAppMounted = true;
    } finally {
      isRendering = false;
    }
  };

  const injectIntoDevTools = (_config: any) => {
    rendererPackageName = _config.rendererPackageName || rendererPackageName;

    ReconcilerSet.forEach((renderDispatch) => (renderDispatch.renderPackage = rendererPackageName));

    if (globalThis["__MY_REACT_DEVTOOL_INTERNAL__"]) return true;

    return false;
  };

  const injectIntoDevToolsAuto = async (url: string, _config: any) => {
    // set core runtime
    // you should load core runtime by your self, see packages/myreact-reconciler-compact/src/preload.ts
    injectIntoDevTools(_config || {});
    // start, see https://github.com/MrWangJustToDo/myreact-devtools/blob/main/packages/bridge/src/hook.ts
    const init = globalThis["__MY_REACT_DEVTOOL_NODE__"] || globalThis["__MY_REACT_DEVTOOL_BUNDLE__"] || globalThis["__MY_REACT_DEVTOOL_BUNDLE_WS__"];

    try {
      await init(url);
    } catch {
      // ignore error
    }
  };

  const getPublicRootInstance = (_container: RenderContainer) => {
    const fiber = _container.__fiber__;
    if (!fiber || !fiber.child) {
      return null;
    }
    return fiber.child.nativeNode;
  };

  const discreteUpdates = <A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R, a: A, b: B, c: C, d: D): R => {
    beforeSyncUpdate();
    try {
      return fn(a, b, c, d);
    } finally {
      afterSyncUpdate();
    }
  };

  const updateContainerSync = (element: MyReactElementNode, container: RenderContainer, ignore: any, callback: () => void) => {
    beforeSyncUpdate();
    try {
      updateContainer(element, container, ignore, callback);
    } finally {
      afterSyncUpdate();
    }
  };

  const flushPassiveEffects = (): boolean => {
    try {
      flushEffectCallback();
      return true;
    } catch {
      return false;
    }
  };

  const isAlreadyRendering = (): boolean => {
    return isRendering;
  };

  const deferredUpdates = <A>(fn: () => A): A => {
    return fn();
  };

  const findHostInstance = (component: any): any => {
    try {
      const fiber = getInstanceOwnerFiber(component);
      if (!fiber) return null;

      let current: MyReactFiberNode | null = fiber;
      while (current) {
        if (current.nativeNode && typeof current.type === "string") {
          return _config?.getPublicInstance ? _config.getPublicInstance(current.nativeNode) : current.nativeNode;
        }
        current = current.child;
      }
      return null;
    } catch {
      return null;
    }
  };

  const findHostInstanceWithWarning = (component: any, _methodName: string): any => {
    return findHostInstance(component);
  };

  const findHostInstanceWithNoPortals = (fiber: any): any => {
    return findHostInstance(fiber);
  };

  const attemptSynchronousHydration = (_fiber: any): void => {
    // no-op: hydration not yet supported in MyReact reconciler-compact
  };

  const attemptDiscreteHydration = (_fiber: any): void => {
    // no-op
  };

  const attemptContinuousHydration = (_fiber: any): void => {
    // no-op
  };

  const attemptHydrationAtCurrentPriority = (_fiber: any): void => {
    // no-op
  };

  const getCurrentUpdatePriority = (): number => {
    return 0;
  };

  const runWithPriority = <T>(_priority: number, fn: () => T): T => {
    return fn();
  };

  const shouldErrorImpl: ((fiber: any) => boolean | undefined) | null = null;
  const shouldSuspendImpl: ((fiber: any) => boolean) | null = null;

  const shouldError = (fiber: any): boolean | undefined => {
    return shouldErrorImpl ? shouldErrorImpl(fiber) : undefined;
  };

  const shouldSuspend = (fiber: any): boolean => {
    return shouldSuspendImpl ? shouldSuspendImpl(fiber) : false;
  };

  const registerMutableSourceForHydration = (_root: any, _mutableSource: any): void => {
    // no-op
  };

  const createComponentSelector = (component: any) => ({ $$typeof: Symbol.for("react.test.selector"), value: component });
  const createHasPseudoClassSelector = (selectors: any[]) => ({ $$typeof: Symbol.for("react.test.selector"), value: selectors });
  const createRoleSelector = (role: string) => ({ $$typeof: Symbol.for("react.test.selector"), value: role });
  const createTextSelector = (text: string) => ({ $$typeof: Symbol.for("react.test.selector"), value: text });
  const createTestNameSelector = (id: string) => ({ $$typeof: Symbol.for("react.test.selector"), value: id });

  const getFindAllNodesFailureDescription = (_hostRoot: any, _selectors: any[]): string | null => {
    return null;
  };

  const findAllNodes = (_hostRoot: any, _selectors: any[]): any[] => {
    return [];
  };

  const findBoundingRects = (_hostRoot: any, _selectors: any[]): any[] => {
    return [];
  };

  const focusWithin = (_hostRoot: any, _selectors: any[]): boolean => {
    return false;
  };

  const observeVisibleRects = (_hostRoot: any, _selectors: any[], _callback: any, _options?: any) => {
    return { disconnect: () => {} };
  };

  return {
    createPortal,
    createContainer,
    createHydrationContainer,
    updateContainer,
    updateContainerSync,
    injectIntoDevTools,
    getPublicRootInstance,
    injectIntoDevToolsAuto,
    flushSync: safeCallWithSync,
    flushSyncWork: safeCallWithSync,
    batchedUpdates: safeCallWithSync,
    discreteUpdates,
    deferredUpdates,
    flushPassiveEffects,
    isAlreadyRendering,
    findHostInstance,
    findHostInstanceWithWarning,
    findHostInstanceWithNoPortals,
    attemptSynchronousHydration,
    attemptDiscreteHydration,
    attemptContinuousHydration,
    attemptHydrationAtCurrentPriority,
    getCurrentUpdatePriority,
    runWithPriority,
    shouldError,
    shouldSuspend,
    registerMutableSourceForHydration,
    createComponentSelector,
    createHasPseudoClassSelector,
    createRoleSelector,
    createTextSelector,
    createTestNameSelector,
    getFindAllNodesFailureDescription,
    findAllNodes,
    findBoundingRects,
    focusWithin,
    observeVisibleRects,
  };
};
