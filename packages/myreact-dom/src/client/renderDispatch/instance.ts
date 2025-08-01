import { __my_react_internal__, __my_react_shared__, createElement } from "@my-react/react";
import {
  CustomRenderDispatch,
  devErrorWithFiber,
  getCurrentDispatchFromFiber,
  getCurrentDispatchFromType,
  getCurrentFibersFromType,
  hmr,
  listenerMap,
  processHook,
  processPromise,
  processState,
  safeCallWithCurrentFiber,
  setRefreshHandler,
  triggerError,
  typeToFibersMap,
  unmountFiber,
} from "@my-react/react-reconciler";

import { __my_react_dom_internal__, __my_react_dom_shared__ } from "@my-react-dom-client";
import { append, clearNode, create, position, update } from "@my-react-dom-client/api";
import { clientDispatchMount } from "@my-react-dom-client/dispatchMount";
import { render } from "@my-react-dom-client/mount";
import { parse, patchDOMField, setRef, unsetRef } from "@my-react-dom-client/tools";
import { latestNoopRender, legacyNoopRender } from "@my-react-dom-noop/mount";
import { asyncUpdateTimeLimit, initialElementMap, unmountElementMap, shouldPauseAsyncUpdate, resetPause } from "@my-react-dom-shared";

import { clientDispatchFiber } from "./dispatch";

import type { MyReactElement, MyReactElementNode, MyReactElementType, RenderHookParams, UpdateQueue } from "@my-react/react";
import type { HMR, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react-reconciler";
import type { PlainElementDev } from "@my-react-dom-server/api";

const { enableScopeTreeLog } = __my_react_shared__;

const { currentComponentFiber, currentScheduler } = __my_react_internal__;

type Listeners = {
  domAppend: Set<(f: MyReactFiberNode) => void>;
  domUpdate: Set<(f: MyReactFiberNode) => void>;
  domSetRef: Set<(f: MyReactFiberNode) => void>;
};

export const domListenersMap = new Map<ClientDomDispatch, Listeners>();

export class ClientDomDispatch extends CustomRenderDispatch {
  runtimeDom = {
    svgMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
    elementMap: new WeakMap<MyReactFiberNode, MyReactFiberNode>(),
  };

  enableUpdate = true;

  enableAsyncLoad = true;

  renderPackage = "@my-react/react-dom";

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

  enableNewEntry: boolean;

  constructor(
    readonly rootNode: any,
    readonly rootFiber: MyReactFiberNode,
    rootElement: MyReactElementNode
  ) {
    super(rootNode, rootFiber, rootElement);

    domListenersMap.set(this, { domAppend: new Set(), domUpdate: new Set(), domSetRef: new Set() });

    if (__DEV__) {
      this.performanceLogTimeLimit = asyncUpdateTimeLimit.current;
    }
  }

  onDOMAppend(cb: (f: MyReactFiberNode) => void) {
    const set = domListenersMap.get(this).domAppend;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceDOMAppend(cb: (f: MyReactFiberNode) => void) {
    const set = domListenersMap.get(this).domAppend;

    const listener = (f: MyReactFiberNode) => {
      cb(f);

      set.delete(listener);
    };

    set.add(listener);
  }

  onDOMUpdate(cb: (f: MyReactFiberNode) => void) {
    const set = domListenersMap.get(this).domUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceDOMUpdate(cb: (f: MyReactFiberNode) => void) {
    const set = domListenersMap.get(this).domUpdate;

    const listener = (f: MyReactFiberNode) => {
      cb(f);

      set.delete(listener);
    };

    set.add(listener);
  }

  onDOMSetRef(cb: (f: MyReactFiberNode) => void) {
    const set = domListenersMap.get(this).domSetRef;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceDOMSetRef(cb: (f: MyReactFiberNode) => void) {
    const set = domListenersMap.get(this).domSetRef;

    const listener = (f: MyReactFiberNode) => {
      cb(f);

      set.delete(listener);
    };

    set.add(listener);
  }

  /**
   * @deprecated
   */
  patchToCommitAppend?: (_fiber: MyReactFiberNode) => void;

  /**
   * @deprecated
   */
  patchToCommitUpdate?: (_fiber: MyReactFiberNode) => void;

  /**
   * @deprecated
   */
  patchToCommitSetRef?: (_fiber: MyReactFiberNode) => void;

  dispatchFiber(_fiber: MyReactFiberNode): void {
    clientDispatchFiber(this, _fiber);
  }

  clientCommitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    return create(this, _fiber, !!_hydrate);
  }
  commitCreate(_fiber: MyReactFiberNode): void {
    this.clientCommitCreate(_fiber);
  }
  clientCommitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    update(this, _fiber, !!_hydrate);
  }
  commitUpdate(_fiber: MyReactFiberNode): void {
    this.clientCommitUpdate(_fiber);
  }
  commitAppend(_fiber: MyReactFiberNode): void {
    append(this, _fiber);
  }
  commitPosition(_fiber: MyReactFiberNode): void {
    position(this, _fiber);
  }
  commitSetRef(_fiber: MyReactFiberNode): void {
    setRef(this, _fiber);
  }
  commitUnsetRef(_fiber: MyReactFiberNode): void {
    unsetRef(_fiber);
  }
  commitClear(_fiber: MyReactFiberNode): void {
    clearNode(_fiber);
  }
  reconcileCommit(_fiber: MyReactFiberNode) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance = this;

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallBeforeCommit() {
        instance.beforeCommit?.();
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallBeforeCommitListener() {
        listenerMap.get(instance)?.beforeCommitMount?.forEach((cb) => cb());
      },
    });

    clientDispatchMount(this, _fiber, this.isHydrateRender);

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallAfterCommitListener() {
        listenerMap.get(instance)?.afterCommitMount?.forEach((cb) => cb());
      },
    });

    safeCallWithCurrentFiber({
      fiber: _fiber,
      action: function safeCallAfterCommit() {
        instance.afterCommit?.();
      },
    });
  }
  shouldYield(): boolean {
    return shouldPauseAsyncUpdate();
  }
  resetYield(): void {
    resetPause();
  }
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(this, _fiber);

    patchDOMField(this, _fiber);
  }
  patchToFiberUpdate(_fiber: MyReactFiberNode) {
    patchDOMField(this, _fiber);
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    unmountElementMap(this, _fiber);
  }

  dispatchState(_params: UpdateQueue): void {
    return processState(this, _params);
  }

  dispatchHook(_params: RenderHookParams): unknown {
    return processHook(this, _params);
  }

  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
    if (__DEV__) devErrorWithFiber(_params.fiber, _params.error);

    const scheduler = currentScheduler.current;

    if (_params.fiber) {
      triggerError(this, _params.fiber, _params.error, function triggerErrorOnFiberCallback() {
        scheduler.yieldTask(function dispatchErrorEvent() {
          window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
        });
      });
    } else {
      scheduler.yieldTask(function dispatchErrorEvent() {
        window.dispatchEvent(new ErrorEvent("error", { error: _params.error, message: _params.error?.message }));
      });
    }

    return null;
  }

  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    return processPromise(this, _params.fiber, _params.promise);
  }
}

export class ClientDomDispatchDev extends ClientDomDispatch {
  __dev_hmr_runtime__: HMR;
  __dev_hmr_remount__: (cb?: () => void) => void;
  _debugVersion: string;
  _debugRender: Promise<PlainElementDev>;
  __my_react__: {
    __my_react_shared__: typeof __my_react_shared__;
    __my_react_internal__: typeof __my_react_internal__;
  };
  __my_react_dom__: {
    __my_react_dom_shared__: typeof __my_react_dom_shared__;
    __my_react_dom_internal__: typeof __my_react_dom_internal__;
  };
}

function hmrRemount(this: ClientDomDispatch, cb?: () => void) {
  const rootNode = this.rootNode;

  const rootElementType = this.rootFiber.elementType;

  const rootElementProps = this.rootFiber.pendingProps;

  const rootElement = createElement(rootElementType as MyReactElementType, rootElementProps) as MyReactElement;

  rootNode.__fiber__ = null;

  render(rootElement, rootNode, cb);
}

if (__DEV__) {
  // dev log tree
  Object.defineProperty(ClientDomDispatch.prototype, "_debugRender", {
    get: function (this: ClientDomDispatch) {
      const rootElementType = this.rootFiber.elementType;

      const rootElementProps = this.rootFiber.pendingProps;

      const rootElement = createElement(rootElementType, rootElementProps);

      const get = async () => {
        if (this.enableNewEntry) {
          const _re = enableScopeTreeLog.current;

          enableScopeTreeLog.current = false;

          const re = await latestNoopRender(rootElement);

          enableScopeTreeLog.current = _re;

          return re;
        } else {
          const _re = enableScopeTreeLog.current;

          enableScopeTreeLog.current = false;

          const re = legacyNoopRender(rootElement);

          enableScopeTreeLog.current = _re;

          return re;
        }
      };

      const re = get();

      re.then((res) => (parse(res), res)).then((res) => {
        unmountFiber(this, res.__container__.rootFiber);
        res.__container__.isAppMounted = false;
        res.__container__.isAppUnmounted = true;
      });

      return re;
    },
  });

  Object.defineProperty(ClientDomDispatch.prototype, "_debugVersion", {
    get: function (this: ClientDomDispatch) {
      return __VERSION__;
    },
  });

  // hmr remount
  Object.defineProperty(ClientDomDispatch.prototype, "__dev_hmr_remount__", {
    value: hmrRemount,
  });

  // hmr runtime
  Object.defineProperty(ClientDomDispatch.prototype, "__dev_hmr_runtime__", {
    value: {
      hmr,
      typeToFibersMap,
      setRefreshHandler,
      currentComponentFiber,
      getCurrentFibersFromType,
      getCurrentDispatchFromType,
      getCurrentDispatchFromFiber,
    } as HMR,
  });

  Object.defineProperty(ClientDomDispatch.prototype, "__my_react__", {
    value: {
      __my_react_shared__,
      __my_react_internal__,
    },
  });

  Object.defineProperty(ClientDomDispatch.prototype, "__my_react_dom__", {
    value: {
      __my_react_dom_shared__,
      __my_react_dom_internal__,
    },
  });
}

// SEE https://github.com/facebook/react/blob/main/packages/react-dom-bindings/src/client/validateDOMNesting.js
export interface MyReactFiberNodeClientDev extends MyReactFiberNodeDev {
  _debugTreeScope: {
    current?: MyReactFiberNodeClientDev;

    formTag?: MyReactFiberNodeClientDev;
    aTagInScope?: MyReactFiberNodeClientDev;
    nobrTagInScope?: MyReactFiberNodeClientDev;
    buttonTagInScope?: MyReactFiberNodeClientDev;
    pTagInButtonScope?: MyReactFiberNodeClientDev;

    dlItemTagAutoClosing?: MyReactFiberNodeClientDev;
    listItemTagAutoClosing?: MyReactFiberNodeClientDev;

    // <head> or <body>
    containerTagInScope?: MyReactFiberNodeClientDev;
  };
}
