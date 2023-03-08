import { ListTree, PATCH_TYPE, UniqueArray } from "@my-react/react-shared";

import { defaultGenerateContextMap, defaultGetContextValue } from "../dispatchContext";
import { defaultGenerateErrorBoundariesMap } from "../dispatchErrorBoundaries";
import { defaultInitialFiberNode, defaultUnmountFiberNode, defaultUpdateFiberNode } from "../dispatchFiber";
import { processHookNode } from "../dispatchHook";
import { defaultResolveLazyElement, defaultResolveLazyElementAsync } from "../dispatchLazy";
import { processClassComponentUpdateQueue, processFunctionComponentUpdateQueue } from "../dispatchQueue";
import { defaultGenerateScopeMap } from "../dispatchScope";
import { defaultGenerateStrictMap } from "../dispatchStrict";
import { defaultGenerateSuspenseMap } from "../dispatchSuspense";
import { defaultGenerateUnmountArrayMap } from "../dispatchUnmount";
import { setRef, effect, layoutEffect, safeCallWithFiber, context, unmount } from "../share";

import { triggerError, triggerUpdate } from "./trigger";

import type { RenderDispatch } from "../runtimeDispatch";
import type { RenderPlatform } from "../runtimePlatform";
import type { createContext, CreateHookParams, MyReactElementNode, MyReactFiberNode, RenderController, RenderScope } from "@my-react/react";

type CustomRenderConfig = {
  patchToFiberInitial?: (_fiber: MyReactFiberNode) => void;
  patchToFiberUpdate?: (_fiber: MyReactFiberNode) => void;
  patchToFiberUnmount?: (_fiber: MyReactFiberNode) => void;
  shouldYield?: () => boolean;
};

const beginCommitFiberList = (scope: RenderScope) => {
  if (scope.pendingCommitFiberList?.length) {
    scope.pendingCommitFiberListArray.push(scope.pendingCommitFiberList);
  }
  scope.pendingCommitFiberList = new ListTree();
};

const endCommitFiberList = (scope: RenderScope) => {
  if (scope.pendingCommitFiberList?.length) {
    scope.pendingCommitFiberListArray.push(scope.pendingCommitFiberList);
  }
  scope.pendingCommitFiberList = null;
};

const generatePendingCommitFiberList = (fiber: MyReactFiberNode) => {
  if (fiber && fiber.isMounted) {
    const renderScope = fiber.root.renderScope;

    renderScope.pendingCommitFiberList = renderScope.pendingCommitFiberList || new ListTree();

    if (fiber.patch & PATCH_TYPE.__pendingGenerateUpdateList__) {
      renderScope.pendingCommitFiberList.append(fiber);
    }
  }
};

export const createRender = ({ patchToFiberInitial, patchToFiberUpdate, patchToFiberUnmount, shouldYield = () => false }: CustomRenderConfig) => {
  const MyWeakMap = typeof WeakMap !== "undefined" ? WeakMap : Map;

  class CustomRenderController implements RenderController {
    renderScope: RenderScope;

    constructor(scope: RenderScope) {
      this.renderScope = scope;
    }

    hasNext() {
      if (this.renderScope.isAppCrashed) return false;

      if (this.renderScope.yieldFiber !== null) return true;

      this.renderScope.modifyFiberRoot = null;

      return this.renderScope.pendingProcessFiberArray.length > 0;
    }

    getNext() {
      const renderScope = this.renderScope;

      if (renderScope.isAppCrashed) return null;

      const yieldFiber = renderScope.yieldFiber;

      renderScope.yieldFiber = null;

      if (yieldFiber) return yieldFiber;

      renderScope.modifyFiberRoot = null;

      while (renderScope.pendingProcessFiberArray.length) {
        const nextProcessFiber = renderScope.pendingProcessFiberArray.uniShift();

        if (nextProcessFiber?.isMounted) {
          nextProcessFiber._triggerUpdate();

          beginCommitFiberList(renderScope);

          renderScope.modifyFiberRoot = nextProcessFiber;

          return nextProcessFiber;
        }
      }

      return null;
    }

    doesPause() {
      return this.renderScope.yieldFiber !== null;
    }

    getTopLevel() {
      return this.renderScope.modifyFiberRoot;
    }

    setTopLevel(_fiber: MyReactFiberNode): void {
      this.renderScope.modifyFiberRoot = _fiber;
    }

    setYield(_fiber: MyReactFiberNode | null) {
      if (_fiber) {
        this.renderScope.yieldFiber = _fiber;
      } else {
        this.renderScope.yieldFiber = null;

        endCommitFiberList(this.renderScope);
      }
    }

    shouldYield(): boolean {
      return shouldYield();
    }

    getUpdateList(_fiber: MyReactFiberNode) {
      if (_fiber.root.renderScope !== this.renderScope) {
        throw new Error("runtime error for @my-react");
      }
      generatePendingCommitFiberList(_fiber);
    }

    reset(): void {
      const renderScope = this.renderScope;

      renderScope.isAppCrashed = false;

      renderScope.yieldFiber = null;

      renderScope.modifyFiberRoot = null;

      renderScope.pendingCommitFiberList = null;

      renderScope.pendingCommitFiberListArray = [];

      renderScope.pendingProcessFiberArray = new UniqueArray();
    }
  }

  class CustomRenderDispatch implements RenderDispatch {
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
    processFiberUpdate(_fiber: MyReactFiberNode): void {
      defaultUpdateFiberNode(_fiber);

      patchToFiberUpdate?.(_fiber);
    }
    processFiberInitial(_fiber: MyReactFiberNode): void {
      defaultInitialFiberNode(_fiber);

      patchToFiberInitial?.(_fiber);
    }
    processFiberUnmount(_fiber: MyReactFiberNode): void {
      defaultUnmountFiberNode(_fiber);

      patchToFiberUnmount?.(_fiber);
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

        safeCallWithFiber({ fiber: _fiber, action: () => setRef(_fiber) });

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
            action: () => setRef(_fiber),
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
      } else {
        _fiber._applyProps();
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

      const exist = this.effectMap.get(_fiber) || [];

      exist.push(_effect);

      this.effectMap.set(_fiber, exist);
    }
    pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
      _fiber.patch |= PATCH_TYPE.__pendingLayoutEffect__;

      const exist = this.layoutEffectMap.get(_fiber) || [];

      exist.push(_layoutEffect);

      this.layoutEffectMap.set(_fiber, exist);
    }
    triggerUpdate(_fiber: MyReactFiberNode): void {
      triggerUpdate(_fiber);
    }
    triggerError(_fiber: MyReactFiberNode, _error: Error): void {
      triggerError(_fiber, _error);
    }
    initialFiberNode(_fiber: MyReactFiberNode): void {
      defaultInitialFiberNode(_fiber);
    }
    updateFiberNode(_fiber: MyReactFiberNode): void {
      defaultUpdateFiberNode(_fiber);
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

  return {
    CustomRenderDispatch,
    CustomRenderController,
  };
};
