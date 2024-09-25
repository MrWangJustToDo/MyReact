import { __my_react_shared__, createElement, type MyReactElement, type MyReactElementNode, type MyReactElementType } from "@my-react/react";
import { CustomRenderDispatch, NODE_TYPE, initHMR, listenerMap, safeCall, unmountFiber } from "@my-react/react-reconciler";

import { append, clearNode, create, position, update } from "@my-react-dom-client/api";
import { clientDispatchMount } from "@my-react-dom-client/dispatchMount";
import { render } from "@my-react-dom-client/mount";
import { latestNoopRender, legacyNoopRender } from "@my-react-dom-noop/mount";
import {
  asyncUpdateTimeLimit,
  initialElementMap,
  unmountElementMap,
  setRef,
  shouldPauseAsyncUpdate,
  unsetRef,
  enableASyncHydrate,
  patchDOMField,
  parse,
} from "@my-react-dom-shared";

import { resolveLazyElementLegacy, resolveLazyElementLatest } from "./lazy";

import type { HMR, MyReactFiberNode, MyReactFiberNodeDev } from "@my-react/react-reconciler";
import type { PlainElementDev } from "@my-react-dom-server/api";

const { enableScopeTreeLog } = __my_react_shared__;

const runtimeRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

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

  version = __VERSION__;

  enableUpdate = true;

  runtimeRef = runtimeRef;

  _previousNativeNode: null | ChildNode = null;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

  enableASyncHydrate = enableASyncHydrate.current;

  constructor(
    readonly rootNode: any,
    readonly rootFiber: MyReactFiberNode
  ) {
    super(rootNode, rootFiber);

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

  clientCommitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    return create(_fiber, this, !!_hydrate);
  }
  commitCreate(_fiber: MyReactFiberNode): void {
    this.clientCommitCreate(_fiber);
  }
  clientCommitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    update(_fiber, this, !!_hydrate);
  }
  commitUpdate(_fiber: MyReactFiberNode): void {
    this.clientCommitUpdate(_fiber);
  }
  commitAppend(_fiber: MyReactFiberNode): void {
    append(_fiber, this);
  }
  commitPosition(_fiber: MyReactFiberNode): void {
    position(_fiber, this);
  }
  commitSetRef(_fiber: MyReactFiberNode): void {
    setRef(_fiber, this);
  }
  commitUnsetRef(_fiber: MyReactFiberNode): void {
    unsetRef(_fiber);
  }
  commitClear(_fiber: MyReactFiberNode): void {
    clearNode(_fiber);
  }
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    if (this.enableASyncHydrate) {
      return resolveLazyElementLatest(_fiber, this);
    } else {
      return resolveLazyElementLegacy(_fiber, this);
    }
  }
  reconcileCommit(_fiber: MyReactFiberNode) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instance = this;

    safeCall(function safeCallBeforeCommit() {
      instance.beforeCommit?.();
    });

    safeCall(function safeCallBeforeCommitListener() {
      listenerMap.get(instance)?.beforeCommit?.forEach((cb) => cb());
    });

    clientDispatchMount(_fiber, this, this.isHydrateRender);

    safeCall(function safeCallAfterCommitListener() {
      listenerMap.get(instance)?.afterCommit?.forEach((cb) => cb());
    });

    safeCall(function safeCallAfterCommit() {
      instance.afterCommit?.();
    });
  }
  shouldYield(): boolean {
    return shouldPauseAsyncUpdate();
  }
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    initialElementMap(_fiber, this);

    patchDOMField(_fiber, this);
  }
  patchToFiberUpdate(_fiber: MyReactFiberNode) {
    patchDOMField(_fiber, this);
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    unmountElementMap(_fiber, this);
  }
}

export interface ClientDomDispatchDev extends ClientDomDispatch {
  __hmr_runtime__: HMR;
  __hmr_remount__: (cb?: () => void) => void;
  _debugVersion: string;
  _debugRender: Promise<PlainElementDev>;
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
        if (this.enableASyncHydrate) {
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
        unmountFiber(res.__container__.rootFiber);
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
  Object.defineProperty(ClientDomDispatch.prototype, "__hmr_remount__", {
    value: hmrRemount,
  });

  // hmr runtime
  Object.defineProperty(ClientDomDispatch.prototype, "__hmr_runtime__", {
    value: {},
  });

  // TODO remove
  Object.defineProperty(ClientDomDispatch.prototype, "_remountOnDev", {
    value: hmrRemount,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  initHMR(ClientDomDispatch.prototype.__hmr_runtime__);
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
