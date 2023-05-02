import { PATCH_TYPE } from "@my-react/react-shared";

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

import type { RenderDispatch } from "./interface";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { NODE_TYPE } from "../share";
import type { createContext, MyReactElementNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export class CustomRenderDispatch implements RenderDispatch {
  typeForRef: NODE_TYPE;

  typeForCreate: NODE_TYPE;

  typeForUpdate: NODE_TYPE;

  typeForAppend: NODE_TYPE;

  typeForHasNode: NODE_TYPE;

  suspenseMap: WeakMap<MyReactFiberNode, MyReactElementNode> = new MyWeakMap();

  strictMap: WeakMap<MyReactFiberNode, boolean> = new MyWeakMap();

  useIdMap: WeakMap<MyReactFiberNode, { initial: number; latest: number }> = new MyWeakMap();

  scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

  errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode> = new MyWeakMap();

  effectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  layoutEffectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  insertionEffectMap: WeakMap<MyReactFiberNode, (() => void)[]> = new MyWeakMap();

  contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>> = new MyWeakMap();

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>[]> = new MyWeakMap();

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any[] }>> = new MyWeakMap();

  pendingCreate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.typeForCreate) {
      _fiber.patch |= PATCH_TYPE.__create__;
    }
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.typeForUpdate) {
      _fiber.patch |= PATCH_TYPE.__update__;
    }
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (_fiber.type & this.typeForAppend) {
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
    if (_fiber.ref && _fiber.type & this.typeForRef) {
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
  pendingInsertionEffect(_fiber: MyReactFiberNode, _insertionEffect: () => void): void {
    _fiber.patch |= PATCH_TYPE.__insertionEffect__;

    defaultGenerateEffectMap(_fiber, _insertionEffect, this.insertionEffectMap);
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
  resolveUseIdMap(_fiber: MyReactFiberNode): void {
    defaultGenerateUseIdMap(_fiber, this.useIdMap);
  }
  resolveUseId(_fiber: MyReactFiberNode): string {
    return defaultGetCurrentId(_fiber, this.useIdMap);
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
    return defaultDispatchMount(this, _fiber, _hydrate);
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
    defaultDispatchUpdate(this, _list);
  }
  shouldYield(): boolean {
    return false;
  }
}
