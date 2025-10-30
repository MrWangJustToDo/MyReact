/* eslint-disable @typescript-eslint/no-this-alias */
import { type createContext, type MyReactElementNode, type lazy } from "@my-react/react";
import { PATCH_TYPE, ListTree, UniqueArray, include, merge, exclude } from "@my-react/react-shared";

import { defaultGetContextFiber, defaultGetContextValue, defaultReadContext } from "../dispatchContext";
import { defaultGenerateEffectMap } from "../dispatchEffect";
import { defaultResolveErrorBoundaries } from "../dispatchErrorBoundaries";
import { defaultDispatchFiber } from "../dispatchFiber";
import { defaultDispatchMount } from "../dispatchMount";
import { defaultResolveScope } from "../dispatchScope";
import { defaultGenerateStrict } from "../dispatchStrict";
import { defaultReadPromise, defaultResolveSuspenseFiber, defaultResolveSuspenseValue } from "../dispatchSuspense";
import { defaultDispatchUnmount, defaultGenerateUnmountMap } from "../dispatchUnmount";
import { defaultDispatchUpdate } from "../dispatchUpdate";
import { loadLazy } from "../processLazy";
import { loadPromise, type PromiseWithState } from "../processPromise";
import { getFiberTree, NODE_TYPE, onceWarnWithKeyAndFiber, safeCall } from "../share";

import { RenderDispatchEvent } from "./event";

import type { RenderDispatch } from "./interface";
import type { MyReactFiberNode, MyReactFiberRoot } from "../runtimeFiber";
import type { HMR } from "../share";

export class CustomRenderDispatch extends RenderDispatchEvent implements RenderDispatch {
  isAppMounted = false;

  isAppCrashed = false;

  isAppUnmounted = false;

  version = __VERSION__;

  id = Math.random().toString(16).slice(2);

  mode = __DEV__ ? "development" : "production";

  enableUpdate: boolean;

  enableNewEntry: boolean;

  enableAsyncLoad: boolean;

  enableConcurrentMode: boolean;

  renderMode = "render";

  renderPackage?: string;

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingCommitFiberPatch: PATCH_TYPE = PATCH_TYPE.__initial__;

  pendingChangedFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray<MyReactFiberNode>();

  pendingSuspenseFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray<MyReactFiberNode>();

  performanceLogTimeLimit: number;

  uniqueIdCount = 0;

  /**
   * @deprecated
   */
  beforeCommit?: () => void;

  /**
   * @deprecated
   */
  afterCommit?: () => void;

  /**
   * @deprecated
   */
  beforeUpdate?: () => void;

  /**
   * @deprecated
   */
  afterUpdate?: () => void;

  /**
   * @deprecated
   */
  beforeUnmount?: () => void;

  /**
   * @deprecated
   */
  afterUnmount?: () => void;

  constructor(
    readonly rootNode: any,
    readonly rootFiber: MyReactFiberNode,
    rootElement: MyReactElementNode
  ) {
    super();

    this.rootElement = rootElement;

    const typedFiber = rootFiber as MyReactFiberRoot;

    typedFiber.renderDispatch = this;
  }

  generateCommitList(_fiber: MyReactFiberNode) {
    if (!_fiber) return;

    this.pendingCommitFiberPatch = merge(this.pendingCommitFiberPatch, _fiber.patch);

    if (_fiber.patch !== PATCH_TYPE.__initial__) {
      this.pendingCommitFiberList = this.pendingCommitFiberList || new ListTree();

      this.pendingCommitFiberList.push(_fiber);
    }
  }

  generateChangedList(_fiber: MyReactFiberNode, withCheck?: boolean) {
    if (!_fiber) return;

    if (!this.isAppMounted) return;

    this.pendingChangedFiberList = this.pendingChangedFiberList || new ListTree();

    if (withCheck && this.pendingChangedFiberList.hasValue(_fiber)) {
      return;
    }

    this.pendingChangedFiberList.push(_fiber);
  }

  pendingCreate(_fiber: MyReactFiberNode): void {
    if (include(_fiber.type, this.runtimeRef.typeForCreate)) {
      _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__create__);
    }
  }
  pendingUpdate(_fiber: MyReactFiberNode): void {
    if (include(_fiber.type, this.runtimeRef.typeForUpdate)) {
      _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__update__);
    }
  }
  pendingAppend(_fiber: MyReactFiberNode): void {
    if (include(_fiber.type, this.runtimeRef.typeForAppend)) {
      _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__append__);
    }
  }
  pendingPosition(_fiber: MyReactFiberNode): void {
    _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__position__);
  }
  pendingRef(_fiber: MyReactFiberNode): void {
    if (_fiber.ref) {
      if (include(_fiber.type, this.runtimeRef.typeForRef)) {
        _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__ref__);
      } else if (exclude(_fiber.type, NODE_TYPE.__forwardRef__)) {
        onceWarnWithKeyAndFiber(_fiber, "ref", `[@my-react/react] set ref for current element will be ignored`);
      }
    }
  }
  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {
    _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__unmount__);

    defaultGenerateUnmountMap(_fiber, _pendingUnmount, this.runtimeMap.unmountMap);
  }
  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void, option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void {
    _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__effect__);

    defaultGenerateEffectMap(_fiber, _effect, this.runtimeMap.effectMap, option);
  }
  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void, option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void {
    _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__layoutEffect__);

    defaultGenerateEffectMap(_fiber, _layoutEffect, this.runtimeMap.layoutEffectMap, option);
  }
  pendingInsertionEffect(_fiber: MyReactFiberNode, _insertionEffect: () => void, option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void {
    _fiber.patch = merge(_fiber.patch, PATCH_TYPE.__insertionEffect__);

    defaultGenerateEffectMap(_fiber, _insertionEffect, this.runtimeMap.insertionEffectMap, option);
  }
  /**
   * @deprecated
   */
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    void 0;
  }
  /**
   * @deprecated
   */
  patchToFiberUpdate(_fiber: MyReactFiberNode) {
    void 0;
  }
  /**
   * @deprecated
   */
  patchToFiberUnmount(_fiber: MyReactFiberNode) {
    void 0;
  }
  dispatchFiber(_fiber: MyReactFiberNode) {
    defaultDispatchFiber(this, _fiber);
  }
  processLazy(_elementType: ReturnType<typeof lazy>): Promise<void> {
    return loadLazy(this, _elementType);
  }
  processPromise(_promise: PromiseWithState<unknown>): Promise<void> {
    return loadPromise(this, _promise);
  }
  commitCreate(_fiber: MyReactFiberNode): void {
    void 0;
  }
  commitUpdate(_fiber: MyReactFiberNode): void {
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
  commitClear(_fiber: MyReactFiberNode): void {
    void 0;
  }
  resolveStrict(_fiber: MyReactFiberNode): boolean {
    return defaultGenerateStrict(_fiber);
  }
  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return defaultResolveScope(_fiber);
  }
  resolveSuspenseValue(_fiber: MyReactFiberNode): MyReactElementNode {
    return defaultResolveSuspenseValue(_fiber);
  }
  resolveSuspenseFiber(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return defaultResolveSuspenseFiber(_fiber);
  }
  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return defaultResolveErrorBoundaries(_fiber);
  }
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode | null {
    return defaultGetContextFiber(_fiber, _contextObject);
  }
  resolveContextValue(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return defaultGetContextValue(_fiber, _contextObject);
  }
  reconcileCommit(_fiber: MyReactFiberNode): void {
    const instance = this;

    safeCall(function safeCallBeforeCommit() {
      instance.beforeCommit?.();
    });

    safeCall(function safeCallBeforeCommitListener() {
      instance.callOnBeforeCommitMount(instance);
    });

    defaultDispatchMount(this, _fiber);

    safeCall(function safeCallAfterCommitListener() {
      instance.callOnAfterCommitMount(instance);
    });

    safeCall(function safeCallAfterCommit() {
      instance.afterCommit?.();
    });
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>, sync?: boolean): void {
    const instance = this;

    safeCall(function safeCallBeforeUpdate() {
      instance.beforeUpdate?.();
    });

    safeCall(function safeCallBeforeUpdateListener() {
      instance.callOnBeforeCommitUpdate(instance);
    });

    defaultDispatchUpdate(this, _list, sync);

    safeCall(function safeCallAfterUpdateListener() {
      instance.callOnAfterCommitUpdate(instance);
    });

    safeCall(function safeCallAfterUpdate() {
      instance.afterUpdate?.();
    });
  }
  reconcileUnmount(): void {
    const instance = this;

    safeCall(function safeCallBeforeUnmount() {
      instance.beforeUnmount?.();
    });

    safeCall(function safeCallBeforeUnmountListener() {
      instance.callOnBeforeCommitUnmount(instance);
    });

    defaultDispatchUnmount(this);

    safeCall(function safeCallAfterUnmountListener() {
      instance.callOnAfterCommitUnmount(instance);
    });

    safeCall(function safeCallAfterUnmount() {
      instance.afterUnmount?.();
    });
  }
  shouldYield(): boolean {
    return false;
  }
  resetYield(): void {
    void 0;
  }
  resetUpdateFlowRuntimeFiber(): void {
    this.runtimeFiber.scheduledFiber = null;

    this.runtimeFiber.nextWorkingFiber = null;

    this.runtimeFiber.retriggerFiber = null;

    this.pendingCommitFiberPatch = PATCH_TYPE.__initial__;
  }

  getFiberTree(_fiber: MyReactFiberNode): string {
    return getFiberTree(_fiber);
  }

  readPromise(_params: Promise<unknown>): unknown {
    return defaultReadPromise(_params);
  }

  readContext(_params: ReturnType<typeof createContext>): unknown {
    return defaultReadContext(_params);
  }
}

export interface CustomRenderDispatchDev extends CustomRenderDispatch {
  __dev_hmr_runtime__: HMR;
  __dev_hmr_remount__: (cb?: () => void) => void;
}
