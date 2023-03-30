import { __my_react_internal__ } from "@my-react/react";
import { PATCH_TYPE } from "@my-react/react-shared";

import { context, defaultGenerateContextMap, defaultGetContextFiber, defaultGetContextValue } from "../dispatchContext";
import { defaultGenerateEffectMap, effect, layoutEffect } from "../dispatchEffect";
import { defaultGenerateErrorBoundariesMap } from "../dispatchErrorBoundaries";
import { defaultGenerateScopeMap } from "../dispatchScope";
import { defaultGenerateStrictMap } from "../dispatchStrict";
import { defaultGenerateSuspenseMap } from "../dispatchSuspense";
import { defaultGenerateUnmountMap, unmount } from "../dispatchUnmount";
import { MyWeakMap, safeCallWithFiber } from "../share";

import type { RenderDispatch } from "./interface";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { NODE_TYPE } from "../share";
import type { createContext, MyReactElementNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

const { currentRenderPlatform } = __my_react_internal__;

export class CustomRenderDispatch implements RenderDispatch {
  refType: NODE_TYPE;

  createType: NODE_TYPE;

  updateType: NODE_TYPE;

  appendType: NODE_TYPE;

  hasNodeType: NODE_TYPE;

  suspenseMap: WeakMap<MyReactFiberNode, MyReactElementNode> = new MyWeakMap();

  strictMap: WeakMap<MyReactFiberNode, boolean> = new MyWeakMap();

  scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

  errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

  effectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  layoutEffectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>> = new MyWeakMap();

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>[]> = new MyWeakMap();

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any[] }>> = new MyWeakMap();

  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.createType) {
      _fiber.patch |= PATCH_TYPE.__create__;
    }
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.updateType) {
      _fiber.patch |= PATCH_TYPE.__update__;
    }
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.appendType) {
      _fiber.patch |= PATCH_TYPE.__append__;
    }
  }
  pendingContext(_fiber: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__context__;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__position__;
  }
  pendingRef(_fiber: MyReactFiberNode): void {
    if (_fiber.ref && _fiber.type & this.refType) {
      _fiber.patch |= PATCH_TYPE.__ref__;
    }
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__unmount__;

    defaultGenerateUnmountMap(_fiber, _pendingUnmount, this.unmountMap);
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__effect__;

    defaultGenerateEffectMap(_fiber, _effect, this.effectMap);
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__layoutEffect__;

    defaultGenerateEffectMap(_fiber, _layoutEffect, this.layoutEffectMap);
  }
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    void 0;
  }
  patchToFiberUpdate(_fiber: MyReactFiberNode) {
    void 0;
  }
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    void 0;
  }
  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    return false;
  }
  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void {
    void 0;
  }
  commitAppend(_fiber: MyReactFiberNode): void {
    void 0;
  }
  commitPosition(_fiber: MyReactFiberNode): void {
    void 0;
  }
  commitSetRef(_fiber: MyReactFiberNode): void {
    void 0;
  }
  commitUnsetRef(_fiber: MyReactFiberNode): void {
    void 0;
  }
  commitClearNode(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }
  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return null;
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    defaultGenerateStrictMap(_fiber, this.strictMap);
  }
  resolveStrict(_fiber: MyReactFiberNode): boolean {
    return this.strictMap.get(_fiber) || false;
  }
  resolveScopeMap(_fiber: MyReactFiberNode): void {
    defaultGenerateScopeMap(_fiber, this.scopeMap);
  }
  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return this.scopeMap.get(_fiber) || null;
  }
  resolveSuspenseMap(_fiber: MyReactFiberNode): void {
    defaultGenerateSuspenseMap(_fiber, this.suspenseMap);
  }
  resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode {
    return this.suspenseMap.get(_fiber) || null;
  }
  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void {
    defaultGenerateErrorBoundariesMap(_fiber, this.errorBoundariesMap);
  }
  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return this.errorBoundariesMap.get(_fiber) || null;
  }
  resolveContextMap(_fiber: MyReactFiberNode): void {
    defaultGenerateContextMap(_fiber, this.contextMap);
  }
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode | null {
    return defaultGetContextFiber(_fiber, _contextObject);
  }
  resolveContextValue(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return defaultGetContextValue(_fiber, _contextObject);
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    const mountCommit = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
      const _result = safeCallWithFiber({
        fiber: _fiber,
        action: () => this.commitCreate(_fiber, _hydrate),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => this.commitUpdate(_fiber, _result),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => this.commitAppend(_fiber),
      });

      let _final = _hydrate;

      if (_fiber.child) _final = mountCommit(_fiber.child, _result);

      safeCallWithFiber({ fiber: _fiber, action: () => this.commitSetRef(_fiber) });

      safeCallWithFiber({ fiber: _fiber, action: () => layoutEffect(_fiber) });

      if (_fiber.sibling) {
        mountCommit(_fiber.sibling, _fiber.nativeNode ? _result : _final);
      }

      if (_fiber.nativeNode) {
        return _result;
      } else {
        return _final;
      }
    };

    const mountEffect = (_fiber: MyReactFiberNode) => {
      if (_fiber.child) mountEffect(_fiber.child);

      effect(_fiber);

      if (_fiber.sibling) mountEffect(_fiber.sibling);
    };

    const mountLoop = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
      const re = mountCommit(_fiber, _hydrate);

      currentRenderPlatform.current.microTask(() => mountEffect(_fiber));

      return re;
    };

    return mountLoop(_fiber, _hydrate);
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({ fiber: _fiber, action: () => unmount(_fiber) });
      }
    });
    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => this.commitCreate(_fiber),
        });
      }
    });
    _list.listToHead((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => this.commitPosition(_fiber),
        });
      }
    });
    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => {
            this.commitAppend(_fiber);
            this.commitUpdate(_fiber);
            this.commitSetRef(_fiber);
          },
        });
        safeCallWithFiber({
          fiber: _fiber,
          action: () => {
            context(_fiber);
            layoutEffect(_fiber);
          },
        });
      }
    });
    currentRenderPlatform.current.microTask(() => _list.listToFoot((_fiber) => effect(_fiber)));
  }
  shouldYield(): boolean {
    return false;
  }
}
