import { triggerUpdate } from '../../../core';
import { safeCallWithFiber } from '../../../share';
import { updateAllAsync, updateAllSync } from '../update';

import { append } from './append';
import { context } from './context';
import { create } from './create';
import { effect, layoutEffect } from './effect';
import { position } from './position';
import { unmount } from './unmount';
import { update } from './update';

import type { FiberDispatch } from '../../../dispatch';
import type { MyReactFiberNode } from '../../../fiber';

export class ClientDispatch implements FiberDispatch {
  trigger(_fiber: MyReactFiberNode): void {
    triggerUpdate(_fiber);
  }
  reconcileCreate(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void {
    const _result = safeCallWithFiber({
      fiber: _fiber,
      action: () => create(_fiber, _hydrate, _parentFiberWithDom),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => update(_fiber, _result),
    });

    if (_fiber.__needReconcile__ && _fiber.child) {
      this.reconcileCreate(
        _fiber.child,
        _result,
        _fiber.dom ? _fiber : _parentFiberWithDom
      );
    }

    if (_fiber.sibling) {
      this.reconcileCreate(_fiber.sibling, _result, _parentFiberWithDom);
    }
  }
  reconcileCommit(
    _fiber: MyReactFiberNode,
    _hydrate: boolean,
    _parentFiberWithDom: MyReactFiberNode
  ): void {
    context(_fiber);

    safeCallWithFiber({ fiber: _fiber, action: () => unmount(_fiber) });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => position(_fiber, _parentFiberWithDom),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => append(_fiber, _parentFiberWithDom.dom as Element),
    });

    _fiber.applyRef();

    if (_fiber.__needReconcile__ && _fiber.child) {
      this.reconcileCommit(
        _fiber.child,
        _hydrate,
        _fiber.dom ? _fiber : _parentFiberWithDom
      );
    }

    safeCallWithFiber({ fiber: _fiber, action: () => layoutEffect(_fiber) });

    effect(_fiber);

    _fiber.__needReconcile__ = false;

    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _hydrate, _parentFiberWithDom);
    }
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    if (
      !_fiber.__isTextNode__ &&
      !_fiber.__isPlainNode__ &&
      !_fiber.__isPortal__
    )
      return;
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
    _fiber.__pendingContext__ = true;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    _fiber.__pendingPosition__ = true;
  }
  pendingUnmount(
    _fiber: MyReactFiberNode,
    _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]
  ): void {
    _fiber.unmountQueue.push(_pendingUnmount);
  }
  pendingLayoutEffect(
    _fiber: MyReactFiberNode,
    _layoutEffect: () => void
  ): void {
    _fiber.layoutEffectQueue.push(_layoutEffect);
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    _fiber.effectQueue.push(_effect);
  }
  updateAllSync(): void {
    updateAllSync();
  }
  updateAllAsync(): void {
    updateAllAsync();
  }
}
