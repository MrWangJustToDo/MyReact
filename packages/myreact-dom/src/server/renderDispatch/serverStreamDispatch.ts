import { CustomRenderDispatch, NODE_TYPE, safeCallWithFiber } from "@my-react/react-reconciler";

import { createCloseTagWithStream, createStartTagWithStream } from "@my-react-dom-server";

import { resolveLazyElement, resolveLazyElementAsync } from "./lazy";

import type { MyReactElementNode } from "@my-react/react";
import type { MyReactFiberNode } from "@my-react/react-reconciler";
import type { ServerStreamContainer } from "@my-react-dom-server";

export class ServerStreamDispatch extends CustomRenderDispatch {
  elementMap = new WeakMap<MyReactFiberNode, { isSVG: boolean; parentFiberWithNode: MyReactFiberNode | null }>();

  refType = NODE_TYPE.__plain__ | NODE_TYPE.__class__;

  createType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__;

  updateType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__;

  appendType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__;

  hasNodeType = NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__;

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

  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return resolveLazyElement(_fiber);
  }

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return resolveLazyElementAsync(_fiber);
  }

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    const renderContainer = _fiber.container as ServerStreamContainer;

    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithFiber({ fiber: _fiber, action: () => createStartTagWithStream(_fiber) });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithFiber({ fiber: _fiber, action: () => createCloseTagWithStream(_fiber) });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    Promise.resolve()
      .then(() => mountLoop(_fiber))
      .then(() => renderContainer.stream.push(null));

    return true;
  }
}