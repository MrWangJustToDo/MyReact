import { CustomRenderDispatch, NODE_TYPE } from "@my-react/react-reconciler";

import { append, create, update } from "@my-react-dom-server";
import { patchToFiberInitial } from "@my-react-dom-shared";

import { resolveLazyElementSync, resolveLazyElementAsync } from "./lazy";

import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export class ServerDomDispatch extends CustomRenderDispatch {
  elementMap = new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>();

  typeForRef = NODE_TYPE.__plain__ | NODE_TYPE.__class__;

  typeForCreate = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__;

  typeForUpdate = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__;

  typeForAppend = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__;

  typeForHasNode = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__;

  triggerUpdate(_fiber: MyReactFiberNode): void {
    void 0;
  }

  triggerError(_fiber: MyReactFiberNode, _error: Error): void {
    throw _error;
  }

  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
    void 0;
  }

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    void 0;
  }

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    create(_fiber);

    return true;
  }

  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const { isSVG } = this.elementMap.get(_fiber) || {};

    update(_fiber, isSVG);
  }

  commitAppend(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.elementMap.get(_fiber) || {};

    append(_fiber, parentFiberWithNode);
  }

  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementSync(_fiber);
  }

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return resolveLazyElementAsync(_fiber);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber);
  }
}
