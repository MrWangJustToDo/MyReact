import { __my_react_shared__, createElement, type MyReactElement, type MyReactElementNode, type MyReactElementType } from "@my-react/react";
import { CustomRenderDispatch, NODE_TYPE, unmountFiber } from "@my-react/react-reconciler";

import { append, clearNode, create, position, update } from "@my-react-dom-client/api";
import { clientDispatchMount } from "@my-react-dom-client/dispatchMount";
import { render } from "@my-react-dom-client/mount";
import { highlightUpdateFiber } from "@my-react-dom-client/tools";
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

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const { enableScopeTreeLog } = __my_react_shared__;

const runtimeRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

export class ClientDomDispatch extends CustomRenderDispatch {
  runtimeDom = {
    elementMap: new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>(),
  };

  enableUpdate = true;

  runtimeRef = runtimeRef;

  _previousNativeNode: null | ChildNode = null;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

  _remountOnDev: (cb?: () => void) => void;

  performanceLogTimeLimit = asyncUpdateTimeLimit.current;

  patchToCommitAppend?: (_fiber: MyReactFiberNode) => void;

  patchToCommitUpdate?: (_fiber: MyReactFiberNode) => void;

  patchToCommitSetRef?: (_fiber: MyReactFiberNode) => void;

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    return create(_fiber, this, !!_hydrate);
  }
  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    update(_fiber, this, !!_hydrate);
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
  commitClearNode(_fiber: MyReactFiberNode): void {
    clearNode(_fiber);
  }
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    if (enableASyncHydrate.current) {
      return resolveLazyElementLatest(_fiber, this);
    } else {
      return resolveLazyElementLegacy(_fiber, this);
    }
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    return clientDispatchMount(_fiber, this, _hydrate);
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

if (__DEV__) {
  // dev highlight
  Object.defineProperty(ClientDomDispatch.prototype, "patchToCommitUpdate", {
    value: highlightUpdateFiber,
  });

  // dev remount
  Object.defineProperty(ClientDomDispatch.prototype, "_remountOnDev", {
    value: function (this: ClientDomDispatch, cb?: () => void) {
      const rootNode = this.rootNode;

      const rootElementType = this.rootFiber.elementType;

      const rootElementProps = this.rootFiber.pendingProps;

      const rootElement = createElement(rootElementType as MyReactElementType, rootElementProps) as MyReactElement;

      rootNode.__fiber__ = null;

      render(rootElement, rootNode, cb);
    },
  });

  // dev log tree
  Object.defineProperty(ClientDomDispatch.prototype, "_debugLogTree", {
    get: function (this: ClientDomDispatch) {
      const rootElementType = this.rootFiber.elementType;

      const rootElementProps = this.rootFiber.pendingProps;

      const rootElement = createElement(rootElementType, rootElementProps);

      const get = async () => {
        if (enableASyncHydrate.current) {
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
        unmountFiber(res.__fiber__);
        res.__container__.isAppMounted = false;
        res.__container__.isAppUnmounted = true;
      });

      return re;
    },
  });
}
