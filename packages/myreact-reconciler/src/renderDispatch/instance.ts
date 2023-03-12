import { PATCH_TYPE } from "@my-react/react-shared";

import { context, defaultGenerateContextMap, defaultGetContextValue } from "../dispatchContext";
import { defaultGenerateEffectMap, effect, layoutEffect } from "../dispatchEffect";
import { defaultGenerateErrorBoundariesMap } from "../dispatchErrorBoundaries";
import { processHookNode } from "../dispatchHook";
import { defaultResolveLazyElement, defaultResolveLazyElementAsync } from "../dispatchLazy";
import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../dispatchQueue";
import { defaultGenerateScopeMap } from "../dispatchScope";
import { defaultGenerateStrictMap } from "../dispatchStrict";
import { defaultGenerateSuspenseMap } from "../dispatchSuspense";
import { defaultGenerateUnmountArrayMap, unmount } from "../dispatchUnmount";
import { triggerError, triggerUpdate } from "../renderUpdate";
import { safeCallWithFiber } from "../share";

import type { RenderDispatch } from "./interface";
import type { RenderPlatform } from "../runtimePlatform";
import type { createContext, CreateHookParams, MyReactElementNode, MyReactFiberNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export const MyWeakMap = typeof WeakMap !== "undefined" ? WeakMap : Map;

export class CustomRenderDispatch implements RenderDispatch {
  renderPlatform: RenderPlatform;

  suspenseMap: WeakMap<MyReactFiberNode, MyReactElementNode> = new MyWeakMap();

  strictMap: WeakMap<MyReactFiberNode, boolean> = new MyWeakMap();

  scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

  errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

  effectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  layoutEffectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>> = new MyWeakMap();

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>[]> = new MyWeakMap();

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any[] }>> = new MyWeakMap();

  constructor(renderPlatform: RenderPlatform) {
    this.renderPlatform = renderPlatform;
  }

  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return defaultResolveLazyElement(_fiber);
  }
  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return defaultResolveLazyElementAsync(_fiber);
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
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode {
    if (_contextObject) {
      const contextMap = this.contextMap.get(_fiber);
      return contextMap?.[_contextObject.contextId] || null;
    } else {
      return null;
    }
  }
  resolveContextValue(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return defaultGetContextValue(_fiber, _contextObject);
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): boolean {
    const renderPlatform = this.renderPlatform;

    const mountLoop = (_fiber: MyReactFiberNode, _hydrate: boolean) => {
      const _result = safeCallWithFiber({
        fiber: _fiber,
        action: () => renderPlatform.create(_fiber, _hydrate),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => renderPlatform.update(_fiber, _result),
      });

      safeCallWithFiber({
        fiber: _fiber,
        action: () => renderPlatform.append(_fiber),
      });

      let _final = _hydrate;

      if (_fiber.child) _final = mountLoop(_fiber.child, _result);

      safeCallWithFiber({ fiber: _fiber, action: () => renderPlatform.setRef(_fiber) });

      safeCallWithFiber({ fiber: _fiber, action: () => layoutEffect(_fiber) });

      renderPlatform.macroTask(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));

      if (_fiber.sibling) {
        mountLoop(_fiber.sibling, _fiber.node ? _result : _final);
      }

      if (_fiber.node) {
        return _result;
      } else {
        return _final;
      }
    };

    return mountLoop(_fiber, _hydrate);
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
    const renderPlatform = this.renderPlatform;

    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => renderPlatform.create(_fiber),
        });

        safeCallWithFiber({
          fiber: _fiber,
          action: () => renderPlatform.update(_fiber),
        });

        safeCallWithFiber({
          fiber: _fiber,
          action: () => unmount(_fiber),
        });

        safeCallWithFiber({
          fiber: _fiber,
          action: () => renderPlatform.setRef(_fiber),
        });

        safeCallWithFiber({ fiber: _fiber, action: () => context(_fiber) });
      }
    });

    _list.listToHead((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => renderPlatform.position(_fiber),
        });
      }
    });

    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => renderPlatform.append(_fiber),
        });
      }
    });

    _list.listToFoot((_fiber) => {
      if (_fiber.isMounted) {
        safeCallWithFiber({
          fiber: _fiber,
          action: () => layoutEffect(_fiber),
        });

        renderPlatform.macroTask(() => safeCallWithFiber({ fiber: _fiber, action: () => effect(_fiber) }));
      }
    });
  }
  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.renderPlatform.createType) {
      _fiber.patch |= PATCH_TYPE.__pendingCreate__;
    }
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.renderPlatform.updateType) {
      _fiber.patch |= PATCH_TYPE.__pendingUpdate__;
    }
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.renderPlatform.appendType) {
      _fiber.patch |= PATCH_TYPE.__pendingAppend__;
    }
  }
  pendingContext(_fiber: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__pendingContext__;
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__pendingPosition__;
  }
  pendingRef(_fiber: MyReactFiberNode): void {
    if (_fiber.ref && _fiber.type & this.renderPlatform.refType) {
      _fiber.patch |= PATCH_TYPE.__pendingRef__;
    }
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | (MyReactFiberNode | MyReactFiberNode[])[]): void {
    _fiber.patch |= PATCH_TYPE.__pendingUnmount__;

    defaultGenerateUnmountArrayMap(_fiber, _pendingUnmount, this.unmountMap);
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__pendingEffect__;

    defaultGenerateEffectMap(_fiber, _effect, this.effectMap);
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__pendingLayoutEffect__;

    defaultGenerateEffectMap(_fiber, _layoutEffect, this.layoutEffectMap);
  }
  triggerUpdate(_fiber: MyReactFiberNode): void {
    triggerUpdate(_fiber);
  }
  triggerError(_fiber: MyReactFiberNode, _error: Error): void {
    triggerError(_fiber, _error);
  }
  resolveHookNode(_fiber: MyReactFiberNode, _hookParams: CreateHookParams) {
    return processHookNode(_fiber, _hookParams);
  }
  processClassComponentQueue(_fiber: MyReactFiberNode): void {
    const needUpdate = processClassComponentUpdateQueue(_fiber);

    if (needUpdate) _fiber._update();
  }
  processFunctionComponentQueue(_fiber: MyReactFiberNode): void {
    const needUpdate = processFunctionComponentUpdateQueue(_fiber);

    if (needUpdate) _fiber._update();
  }
}
