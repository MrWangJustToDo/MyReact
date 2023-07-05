import { CustomRenderDispatch, NODE_TYPE } from "@my-react/react-reconciler";

import { append, create, update } from "@my-react-dom-server";
import { patchToFiberInitial } from "@my-react-dom-shared";

import { resolveLazyElementStatic } from "./lazy";

import type { MyReactElementNode } from "@my-react/react";
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
export class ServerStaticDispatch extends CustomRenderDispatch {
  runtimeDom = {
    elementMap: new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>(),
  };

  runtimeRef = runtimeRef;

  isHydrateRender: boolean;

  isClientRender: boolean;

  isServerRender: boolean;

  renderTime: number | null;

  hydrateTime: number | null;

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
    create(_fiber, this);

    return true;
  }

  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    const { isSVG } = this.runtimeDom.elementMap.get(_fiber) || {};

    update(_fiber, isSVG);
  }

  commitAppend(_fiber: MyReactFiberNode): void {
    const { parentFiberWithNode } = this.runtimeDom.elementMap.get(_fiber) || {};

    append(_fiber, parentFiberWithNode);
  }

  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementStatic(_fiber, this);
  }

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    throw new Error(`[@my-react/react-dom] 'renderToStaticMarkup' not support resolve lazy component on the Server, this is a internal bug`);
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber, this);
  }
}