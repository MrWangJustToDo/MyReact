import { __myreact_shared__ } from "@my-react/react";

import {
  getFiberWithDom,
  LinkTreeList,
  pendingUpdateFiberList,
  pendingUpdateFiberListArray,
  triggerUpdate,
} from "@ReactDOM_shared";

import { updateAllAsync, updateAllSync } from "../update";

import { append } from "./append";
import { context } from "./context";
import { create } from "./create";
import { effect, layoutEffect } from "./effect";
import { fallback } from "./fallback";
import { position } from "./position";
import { unmount } from "./unmount";
import { update } from "./update";

import type { MyReactFiberNode, FiberDispatch } from "@my-react/react";

const { safeCallWithFiber } = __myreact_shared__;

export class ClientDispatch implements FiberDispatch {
  trigger(_fiber: MyReactFiberNode): void {
    triggerUpdate(_fiber);
  }
  resolveLazy(): boolean {
    return true;
  }
  beginProgressList(): void {
    pendingUpdateFiberList.current = new LinkTreeList();
  }
  endProgressList(): void {
    if (pendingUpdateFiberList.current?.length) {
      pendingUpdateFiberListArray.current.push(pendingUpdateFiberList.current);
    }
    pendingUpdateFiberList.current = null;
  }
  generateUpdateList(_fiber: MyReactFiberNode): void {
    if (_fiber) {
      if (pendingUpdateFiberList.current) {
        if (
          _fiber.__pendingCreate__ ||
          _fiber.__pendingUpdate__ ||
          _fiber.__pendingAppend__ ||
          _fiber.__pendingContext__ ||
          _fiber.__pendingPosition__ ||
          _fiber.__effectQueue__.length ||
          _fiber.__unmountQueue__.length ||
          _fiber.__layoutEffectQueue__.length
        ) {
          pendingUpdateFiberList.current.append(_fiber, _fiber.fiberIndex);
        }
      } else {
        throw new Error("error");
      }
    }
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean {
    const _result = safeCallWithFiber({
      fiber: _fiber,
      action: () => create(_fiber, _hydrate, _parentFiberWithDom),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => update(_fiber, _result),
    });

    safeCallWithFiber({
      fiber: _fiber,
      action: () => append(_fiber, _parentFiberWithDom),
    });

    let _final = _hydrate;

    if (_fiber.child) {
      _final = this.reconcileCommit(_fiber.child, _result, _fiber.dom ? _fiber : _parentFiberWithDom);
      fallback(_fiber);
    }

    safeCallWithFiber({ fiber: _fiber, action: () => layoutEffect(_fiber) });

    Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));

    if (_fiber.sibling) {
      this.reconcileCommit(_fiber.sibling, _fiber.dom ? _result : _final, _parentFiberWithDom);
    }

    if (_fiber.dom) {
      return _result;
    } else {
      return _final;
    }
  }
  reconcileCreate(_list: LinkTreeList<MyReactFiberNode>): void {
    _list.listToFoot((_fiber) => {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => create(_fiber, false, _fiber),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => update(_fiber, false),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => unmount(_fiber),
      });

      safeCallWithFiber({ fiber: _fiber, action: () => context(_fiber) });
    });
  }
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void {
    _list.listToHead((_fiber) => {
      const _parentFiberWithDom = getFiberWithDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

      safeCallWithFiber({
        fiber: _fiber,
        action: () => position(_fiber, _parentFiberWithDom),
      });
    });

    _list.listToFoot((_fiber) => {
      const _parentFiberWithDom = getFiberWithDom(_fiber.parent, (f) => f.parent) as MyReactFiberNode;

      safeCallWithFiber({
        fiber: _fiber,
        action: () => append(_fiber, _parentFiberWithDom),
      });
    });

    _list.reconcile((_fiber) => {
      safeCallWithFiber({
        fiber: _fiber,
        action: () => layoutEffect(_fiber),
      });

      Promise.resolve().then(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));
    });
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    if (!_fiber.__isTextNode__ && !_fiber.__isPlainNode__ && !_fiber.__isPortal__) return;
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
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[]): void {
    _fiber.__unmountQueue__.push(_pendingUnmount);
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    _fiber.__layoutEffectQueue__.push(_layoutEffect);
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    _fiber.__effectQueue__.push(_effect);
  }
  updateAllSync(): void {
    updateAllSync();
  }
  updateAllAsync(): void {
    updateAllAsync();
  }
}
