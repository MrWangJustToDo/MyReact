import { createElement, type MyReactElement, type MyReactElementNode } from "@my-react/react";
import { CustomRenderDispatch, NODE_TYPE } from "@my-react/react-reconciler";

import { append, clearNode, create, position, update } from "@my-react-dom-client/api";
import { clientDispatchMount } from "@my-react-dom-client/dispatchMount";
import { render } from "@my-react-dom-client/mount";
import { asyncUpdateTimeLimit, initialElementMap, unmountElementMap, setRef, shouldPauseAsyncUpdate, unsetRef, enableASyncHydrate } from "@my-react-dom-shared";

import { resolveLazyElementLegacy, resolveLazyElementLatest } from "./lazy";

import type { MyReactFiberNode } from "@my-react/react-reconciler";

const runtimeRef: CustomRenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

/**
 * @internal
 */
export class ClientDomDispatch extends CustomRenderDispatch {
  runtimeDom = {
    elementMap: new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>(),
  };

  runtimeRef = runtimeRef;

  _previousNativeNode: null | ChildNode = null;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

  performanceLogTimeLimit = asyncUpdateTimeLimit.current;

  pathToCommitAppend?: (_fiber: MyReactFiberNode) => void;

  pathToCommitUpdate?: (_fiber: MyReactFiberNode) => void;

  pathToCommitSetRef?: (_fiber: MyReactFiberNode) => void;

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
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    unmountElementMap(_fiber, this);
  }
}

if (__DEV__) {
  ClientDomDispatch.prototype.remountOnDev = function (cb?: () => void) {
    const rootNode = this.rootNode;

    const rootElementType = this.rootFiber.elementType;

    const rootElementProps = this.rootFiber.pendingProps;

    const rootElement = createElement(rootElementType, rootElementProps) as MyReactElement;

    rootNode.__fiber__ = null;

    render(rootElement, rootNode, cb);
  };
}
