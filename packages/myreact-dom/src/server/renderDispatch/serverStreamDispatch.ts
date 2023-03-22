import { CustomRenderDispatch, safeCallWithFiber } from "@my-react/react-reconciler";

import type { MyReactFiberNode } from "@my-react/react";
import type { ServerStreamPlatform } from "@my-react-dom-server/renderPlatform";

export class ServerStreamDispatch extends CustomRenderDispatch {
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

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    const renderPlatform = this.renderPlatform as ServerStreamPlatform;

    const mountLoop = (_fiber: MyReactFiberNode) => {
      safeCallWithFiber({ fiber: _fiber, action: () => renderPlatform.createStartTagWithStream(_fiber) });

      if (_fiber.child) mountLoop(_fiber.child);

      safeCallWithFiber({ fiber: _fiber, action: () => renderPlatform.createCloseTagWithStream(_fiber) });

      if (_fiber.sibling) mountLoop(_fiber.sibling);
    };

    Promise.resolve()
      .then(() => mountLoop(_fiber))
      .then(() => renderPlatform.stream.push(null));

    return true;
  }
}
