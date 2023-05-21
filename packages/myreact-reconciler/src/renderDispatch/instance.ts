import { PATCH_TYPE, ListTree , UniqueArray } from "@my-react/react-shared";

import { defaultGenerateContextMap, defaultGetContextFiber, defaultGetContextValue } from "../dispatchContext";
import { defaultGenerateEffectMap } from "../dispatchEffect";
import { defaultGenerateErrorBoundariesMap } from "../dispatchErrorBoundaries";
import { defaultDispatchMount } from "../dispatchMount";
import { defaultGenerateScopeMap } from "../dispatchScope";
import { defaultGenerateStrictMap } from "../dispatchStrict";
import { defaultGenerateSuspenseMap } from "../dispatchSuspense";
import { defaultGenerateUnmountMap } from "../dispatchUnmount";
import { defaultDispatchUpdate } from "../dispatchUpdate";
import { defaultGenerateUseIdMap, defaultGetCurrentId } from "../dispatchUseId";
import { MyWeakMap } from "../share";

import type { fiberKey, refKey, RenderDispatch, RuntimeMap } from "./interface";
import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberContainer, MyReactFiberNode } from "../runtimeFiber";
import type { NODE_TYPE } from "../share";
import type { createContext, MyReactElementNode } from "@my-react/react";

export class CustomRenderDispatch implements RenderDispatch {
  runtimeRef: Record<refKey, NODE_TYPE>;

  runtimeMap: RuntimeMap = {
    suspenseMap: new MyWeakMap(),

    strictMap: new MyWeakMap(),

    useIdMap: new MyWeakMap(),

    scopeMap: new MyWeakMap(),

    errorBoundariesMap: new MyWeakMap(),

    effectMap: new MyWeakMap(),

    layoutEffectMap: new MyWeakMap(),

    insertionEffectMap: new MyWeakMap(),

    contextMap: new MyWeakMap(),

    unmountMap: new MyWeakMap(),

    eventMap: new MyWeakMap(),
  };

  runtimeFiber: Record<fiberKey, MyReactFiberNode | null> = {
    scheduledFiber: null,
    errorCatchFiber: null,
    nextWorkingFiber: null,
  };

  isAppMounted = false;

  isAppCrashed = false;

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray<MyReactFiberNode>();

  constructor(readonly rootNode: any, readonly rootFiber: MyReactFiberNode, readonly renderPlatform: CustomRenderPlatform) {
    const typedFiber = rootFiber as MyReactFiberContainer;

    typedFiber.containerNode = rootNode;
  }

  generateCommitList(_fiber: MyReactFiberNode) {
    if (!_fiber) return;

    if (_fiber.patch !== PATCH_TYPE.__initial__) {
      this.pendingCommitFiberList = this.pendingCommitFiberList || new ListTree();

      this.pendingCommitFiberList.push(_fiber);
    }
  }

  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.runtimeRef.typeForCreate) {
      _fiber.patch |= PATCH_TYPE.__create__;
    }
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.runtimeRef.typeForUpdate) {
      _fiber.patch |= PATCH_TYPE.__update__;
    }
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.runtimeRef.typeForAppend) {
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
    if (_fiber.ref && _fiber.type & this.runtimeRef.typeForRef) {
      _fiber.patch |= PATCH_TYPE.__ref__;
    }
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {
    _fiber.patch |= PATCH_TYPE.__unmount__;

    defaultGenerateUnmountMap(_fiber, _pendingUnmount, this.runtimeMap.unmountMap);
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__effect__;

    defaultGenerateEffectMap(_fiber, _effect, this.runtimeMap.effectMap);
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__layoutEffect__;

    defaultGenerateEffectMap(_fiber, _layoutEffect, this.runtimeMap.layoutEffectMap);
  }
  pendingInsertionEffect(_fiber: MyReactFiberNode, _insertionEffect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__insertionEffect__;

    defaultGenerateEffectMap(_fiber, _insertionEffect, this.runtimeMap.insertionEffectMap);
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
  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }
  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode> {
    return null;
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    defaultGenerateStrictMap(_fiber, this.runtimeMap.strictMap);
  }
  resolveStrict(_fiber: MyReactFiberNode): boolean {
    return this.runtimeMap.strictMap.get(_fiber) || false;
  }
  resolveUseIdMap(_fiber: MyReactFiberNode): void {
    defaultGenerateUseIdMap(_fiber, this.runtimeMap.useIdMap);
  }
  resolveUseId(_fiber: MyReactFiberNode): string {
    return defaultGetCurrentId(_fiber, this.runtimeMap.useIdMap);
  }
  resolveScopeMap(_fiber: MyReactFiberNode): void {
    defaultGenerateScopeMap(_fiber, this.runtimeMap.scopeMap);
  }
  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return this.runtimeMap.scopeMap.get(_fiber) || null;
  }
  resolveSuspenseMap(_fiber: MyReactFiberNode): void {
    defaultGenerateSuspenseMap(_fiber, this.runtimeMap.suspenseMap);
  }
  resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode {
    return this.runtimeMap.suspenseMap.get(_fiber) || null;
  }
  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void {
    defaultGenerateErrorBoundariesMap(_fiber, this.runtimeMap.errorBoundariesMap);
  }
  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return this.runtimeMap.errorBoundariesMap.get(_fiber) || null;
  }
  resolveContextMap(_fiber: MyReactFiberNode): void {
    defaultGenerateContextMap(_fiber, this.runtimeMap.contextMap);
  }
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode | null {
    return defaultGetContextFiber(_fiber, this, _contextObject);
  }
  resolveContextValue(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return defaultGetContextValue(_fiber, _contextObject);
  }
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean {
    return defaultDispatchMount(_fiber, this, _hydrate);
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
    defaultDispatchUpdate(_list, this);
  }
  shouldYield(): boolean {
    return false;
  }
}
