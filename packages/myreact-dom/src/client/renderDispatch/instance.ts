import { CustomRenderDispatch, NODE_TYPE } from "@my-react/react-reconciler";

import { append, clearNode, clientDispatchMount, create, position, render, update } from "@my-react-dom-client";
import { asyncUpdateTimeLimit, patchToFiberInitial, patchToFiberUnmount, setRef, shouldPauseAsyncUpdate, unsetRef } from "@my-react-dom-shared";

import { resolveLazyElementSync, resolveLazyElementAsync } from "./lazy";

import type { MyReactElement, MyReactElementNode } from "@my-react/react";
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

  previousNativeNode: null | ChildNode = null;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

  performanceLogTimeLimit = asyncUpdateTimeLimit.current;

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
    setRef(_fiber);
  }
  commitUnsetRef(_fiber: MyReactFiberNode): void {
    unsetRef(_fiber);
  }
  commitClearNode(_fiber: MyReactFiberNode): void {
    clearNode(_fiber);
  }
  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementSync(_fiber, this);
  }
  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return resolveLazyElementAsync(_fiber);
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    return clientDispatchMount(_fiber, this, _hydrate);
  }
  shouldYield(): boolean {
    return shouldPauseAsyncUpdate();
  }
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber, this);
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    patchToFiberUnmount(_fiber, this);
  }
}

if (__DEV__) {
  ClientDomDispatch.prototype.remountOnDev = function () {
    const rootNode = this.rootNode;

    const rootElement = this.rootFiber.element as MyReactElement;

    render(rootElement, rootNode);
  };
}
