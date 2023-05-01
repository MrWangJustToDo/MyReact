import { CustomRenderDispatch, NODE_TYPE } from "@my-react/react-reconciler";

import { append, clearNode, clientDispatchMount, create, position, update } from "@my-react-dom-client";
import { patchToFiberInitial, patchToFiberUnmount, setRef, shouldPauseAsyncUpdate, unsetRef } from "@my-react-dom-shared";

import { resolveLazyElement, resolveLazyElementAsync } from "./lazy";

import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export class ClientDomDispatch extends CustomRenderDispatch {
  elementMap = new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>();

  previousNativeNode: null | ChildNode = null;

  refType = NODE_TYPE.__plain__ | NODE_TYPE.__class__;

  createType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__;

  updateType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__;

  appendType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__;

  hasNodeType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__;

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    const { isSVG, parentFiberWithNode } = this.elementMap.get(_fiber) || {};

    return create(_fiber, !!_hydrate, parentFiberWithNode, this.previousNativeNode, isSVG);
  }
  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const { isSVG } = this.elementMap.get(_fiber) || {};

    update(_fiber, !!_hydrate, isSVG);
  }
  commitAppend(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};

    append(_fiber, parentFiberWithNode);
  }
  commitPosition(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};

    position(_fiber, parentFiberWithNode);
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
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElement(_fiber);
  }
  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return resolveLazyElementAsync(_fiber);
  }

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    return clientDispatchMount(this, _fiber, _hydrate);
  }
  shouldYield(): boolean {
    return shouldPauseAsyncUpdate();
  }
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber);
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    patchToFiberUnmount(_fiber);
  }
}
