import { safeCallWithFiber } from '../../share';

import { append, create, update } from './dom';

import type { FiberDispatch } from '../../dispatch';
import type { MyReactFiberNode } from '../../fiber';

export class ServerDispatch implements FiberDispatch {
  trigger(_fiber: MyReactFiberNode): void {
    void 0;
  }
  reconcileCreate(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void {
    void 0;
  }
  reconcileCommit(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void {
    if (_fiber.__needReconcile__) {
      safeCallWithFiber({ fiber: _fiber, action: () => create(_fiber) });
      safeCallWithFiber({ fiber: _fiber, action: () => update(_fiber) });
      safeCallWithFiber({
        fiber: _fiber,
        action: () => append(_fiber, _parentFiberWithDom.dom as Element),
      });
      if (_fiber.child) {
        this.reconcileCommit(
          _fiber.child,
          _hydrate,
          _fiber.dom ? _fiber : _parentFiberWithDom
        );
      }
      _fiber.__needReconcile__ = false;
    }
    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _hydrate, _parentFiberWithDom);
    }
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.__isPortal__)
      throw new Error('should not use portal element on the server');
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingCreate__ = true;
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingUpdate__ = true;
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__) return;
    _fiber.__pendingAppend__ = true;
  }
  pendingContext(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }
  pendingUnmount(
    _fiber: MyReactFiberNode,
    _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]
  ): void {
    void 0;
  }
  pendingLayoutEffect(
    _fiber: MyReactFiberNode,
    _layoutEffect: () => void
  ): void {
    void 0;
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    void 0;
  }
  updateAllSync(): void {
    void 0;
  }
  updateAllAsync(): void {
    void 0;
  }
}
