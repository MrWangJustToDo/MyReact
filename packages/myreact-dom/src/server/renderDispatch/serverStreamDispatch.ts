import { CustomRenderDispatch, NODE_TYPE, safeCallWithFiber } from "@my-react/react-reconciler";

import { createCloseTagWithStream, createStartTagWithStream } from "@my-react-dom-server";
import { patchToFiberInitial } from "@my-react-dom-shared";

import { resolveLazyElementSync, resolveLazyElementAsync, resolveLazyElementStatic } from "./lazy";

import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";

export type SimpleReadable = {
  push(chunk: string | null): void;
  destroy(err: any): void;
};

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
export class ServerStreamDispatch extends CustomRenderDispatch {
  runtimeDom = {
    elementMap: new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>(),
  };

  runtimeRef = runtimeRef;

  stream: SimpleReadable;

  lastIsStringNode: boolean;

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

  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementSync(_fiber, this);
  }

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return resolveLazyElementAsync(_fiber);
  }

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithFiber({ fiber: _fiber, action: () => createStartTagWithStream(_fiber, this) });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithFiber({ fiber: _fiber, action: () => createCloseTagWithStream(_fiber, this) });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    Promise.resolve()
      .then(() => mountLoop(_fiber))
      .then(() => this.stream.push(null));

    return true;
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber, this);
  }
}

export class ServerStaticStreamDispatch extends CustomRenderDispatch {
  runtimeDom = {
    elementMap: new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>(),
  };

  runtimeRef = runtimeRef;

  stream: SimpleReadable;

  lastIsStringNode: boolean;

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

  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElementStatic(_fiber, this);
  }

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    throw new Error(`[@my-react/react-dom] 'renderToStaticNodeStream' not support resolve lazy component on the Server, this is a internal bug`);
  }

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithFiber({ fiber: _fiber, action: () => createStartTagWithStream(_fiber, this) });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithFiber({ fiber: _fiber, action: () => createCloseTagWithStream(_fiber, this) });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    Promise.resolve()
      .then(() => mountLoop(_fiber))
      .then(() => this.stream.push(null));

    return true;
  }

  patchToFiberInitial(_fiber: MyReactFiberNode) {
    patchToFiberInitial(_fiber, this);
  }
}
