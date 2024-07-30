/* eslint-disable max-lines */
import { PATCH_TYPE, ListTree, UniqueArray, include, merge, exclude } from "@my-react/react-shared";

import { defaultGenerateContextMap, /*  defaultGetContextFiber, */ defaultGetContextFiber_New, defaultGetContextValue } from "../dispatchContext";
import { defaultGenerateEffectMap } from "../dispatchEffect";
import { defaultGenerateErrorBoundariesMap, defaultResolveErrorBoundaries } from "../dispatchErrorBoundaries";
import { defaultDispatchMount } from "../dispatchMount";
import { defaultGenerateScopeMap } from "../dispatchScope";
import { defaultGenerateStrict, defaultGenerateStrictMap } from "../dispatchStrict";
import { defaultGenerateSuspenseMap, defaultResolveSuspense } from "../dispatchSuspense";
import { defaultDispatchUnmount, defaultGenerateUnmountMap } from "../dispatchUnmount";
import { defaultDispatchUpdate } from "../dispatchUpdate";
import { MyWeakMap, NODE_TYPE, onceWarnWithKeyAndFiber, safeCall } from "../share";

import type { fiberKey, refKey, RenderDispatch, RuntimeMap } from "./interface";
import type { MyReactFiberContainer, MyReactFiberNode } from "../runtimeFiber";
import type { HMR } from "../share";
import type { createContext, MyReactElementNode, UpdateQueue } from "@my-react/react";

type Listeners = {
  fiberInitial: Set<(fiber: MyReactFiberNode) => void>;
  fiberUpdate: Set<(fiber: MyReactFiberNode) => void>;
  fiberUnmount: Set<(fiber: MyReactFiberNode) => void>;
  fiberHMR?: Set<(fiber: MyReactFiberNode) => void>;
  fiberTrigger: Set<(fiber: MyReactFiberNode, updater: UpdateQueue) => void>;
  beforeCommit: Set<() => void>;
  afterCommit: Set<() => void>;
  beforeUpdate: Set<() => void>;
  afterUpdate: Set<() => void>;
  beforeUnmount: Set<() => void>;
  afterUnmount: Set<() => void>;
};

const getInitialValue = (): Listeners => {
  return __DEV__
    ? {
        fiberInitial: new Set(),
        fiberUpdate: new Set(),
        fiberUnmount: new Set(),
        fiberHMR: new Set(),
        fiberTrigger: new Set(),
        beforeCommit: new Set(),
        afterCommit: new Set(),
        beforeUpdate: new Set(),
        afterUpdate: new Set(),
        beforeUnmount: new Set(),
        afterUnmount: new Set(),
      }
    : {
        fiberInitial: new Set(),
        fiberUpdate: new Set(),
        fiberUnmount: new Set(),
        fiberTrigger: new Set(),
        beforeCommit: new Set(),
        afterCommit: new Set(),
        beforeUpdate: new Set(),
        afterUpdate: new Set(),
        beforeUnmount: new Set(),
        afterUnmount: new Set(),
      };
};

export const listenerMap = new Map<RenderDispatch, Listeners>();

export class CustomRenderDispatch implements RenderDispatch {
  runtimeRef: Record<refKey, NODE_TYPE>;

  runtimeMap: RuntimeMap = {
    suspenseMap: new MyWeakMap(),

    strictMap: new MyWeakMap(),

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

  isAppUnmounted = false;

  enableUpdate: boolean;

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingCommitFiberPatch: PATCH_TYPE = PATCH_TYPE.__initial__;

  pendingAsyncLoadFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray<MyReactFiberNode>();

  performanceLogTimeLimit = 2000;

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
    readonly rootFiber: MyReactFiberNode
  ) {
    const typedFiber = rootFiber as MyReactFiberContainer;

    typedFiber.renderDispatch = this;

    listenerMap.set(this, getInitialValue());
  }

  onFiberInitial(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberInitial;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberInitial(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberInitial;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onFiberUpdate(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberUpdate(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberUpdate;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onFiberUnmount(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberUnmount(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberUnmount;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onFiberTrigger(cb: (_fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).fiberTrigger;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberTrigger(cb: (_fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).fiberTrigger;

    const onceCb = (_fiber: MyReactFiberNode, _updater: UpdateQueue) => {
      cb(_fiber, _updater);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onFiberHMR(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberHMR;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceFiberHMR(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).fiberHMR;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onBeforeCommit(cb: () => void) {
    const set = listenerMap.get(this).beforeCommit;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceBeforeCommit(cb: () => void) {
    const set = listenerMap.get(this).beforeCommit;

    const onceCb = () => {
      cb();

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onAfterCommit(cb: () => void) {
    const set = listenerMap.get(this).afterCommit;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceAfterCommit(cb: () => void) {
    const set = listenerMap.get(this).afterCommit;

    const onceCb = () => {
      cb();

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onBeforeUpdate(cb: () => void) {
    const set = listenerMap.get(this).beforeUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceBeforeUpdate(cb: () => void) {
    const set = listenerMap.get(this).beforeUpdate;

    const onceCb = () => {
      cb();

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onAfterUpdate(cb: () => void) {
    const set = listenerMap.get(this).afterUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceAfterUpdate(cb: () => void) {
    const set = listenerMap.get(this).afterUpdate;

    const onceCb = () => {
      cb();

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onBeforeUnmount(cb: () => void) {
    const set = listenerMap.get(this).beforeUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceBeforeUnmount(cb: () => void) {
    const set = listenerMap.get(this).beforeUnmount;

    const onceCb = () => {
      cb();

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onAfterUnmount(cb: () => void) {
    const set = listenerMap.get(this).afterUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceAfterUnmount(cb: () => void) {
    const set = listenerMap.get(this).afterUnmount;

    const onceCb = () => {
      cb();

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  generateCommitList(_fiber: MyReactFiberNode) {
    if (!_fiber) return;

    this.pendingCommitFiberPatch = merge(this.pendingCommitFiberPatch, _fiber.patch);

    if (_fiber.patch !== PATCH_TYPE.__initial__) {
      this.pendingCommitFiberList = this.pendingCommitFiberList || new ListTree();

      this.pendingCommitFiberList.push(_fiber);
    }
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
  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }
  resolveStrictMap(_fiber: MyReactFiberNode): void {
    __DEV__ && defaultGenerateStrictMap(_fiber, this.runtimeMap.strictMap);
  }
  resolveStrict(_fiber: MyReactFiberNode): boolean {
    // return __DEV__ ? this.runtimeMap.strictMap.get(_fiber) || false : false;
    return defaultGenerateStrict(_fiber);
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
    // return this.runtimeMap.suspenseMap.get(_fiber)?.pendingProps?.["fallback"] || null;
    return defaultResolveSuspense(_fiber);
  }
  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void {
    defaultGenerateErrorBoundariesMap(_fiber, this.runtimeMap.errorBoundariesMap);
  }
  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    // return this.runtimeMap.errorBoundariesMap.get(_fiber) || null;
    return defaultResolveErrorBoundaries(_fiber);
  }
  resolveContextMap(_fiber: MyReactFiberNode): void {
    defaultGenerateContextMap(_fiber, this.runtimeMap.contextMap);
  }
  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): MyReactFiberNode | null {
    return defaultGetContextFiber_New(_fiber, this, _contextObject);
  }
  resolveContextValue(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return defaultGetContextValue(_fiber, _contextObject);
  }
  reconcileCommit(_fiber: MyReactFiberNode): void {
    safeCall(() => this.beforeCommit?.());

    safeCall(() => {
      listenerMap.get(this).beforeCommit.forEach((cb) => cb());
    });

    defaultDispatchMount(_fiber, this);

    safeCall(() => {
      listenerMap.get(this).afterCommit.forEach((cb) => cb());
    });

    safeCall(() => this.afterCommit?.());
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
    safeCall(() => this.beforeUpdate?.());

    safeCall(() => {
      listenerMap.get(this).beforeUpdate.forEach((cb) => cb());
    });

    defaultDispatchUpdate(_list, this);

    safeCall(() => {
      listenerMap.get(this).afterUpdate.forEach((cb) => cb());
    });

    safeCall(() => this.afterUpdate?.());
  }
  reconcileUnmount(): void {
    safeCall(() => this.beforeUnmount?.());

    safeCall(() => {
      listenerMap.get(this).beforeUnmount.forEach((cb) => cb());
    });

    defaultDispatchUnmount(this);

    safeCall(() => {
      listenerMap.get(this).afterUnmount.forEach((cb) => cb());
    });

    safeCall(() => this.afterUnmount?.());
  }
  shouldYield(): boolean {
    return false;
  }
  resetUpdateFlowRuntimeFiber(): void {
    this.runtimeFiber.scheduledFiber = null;

    this.runtimeFiber.nextWorkingFiber = null;

    this.pendingCommitFiberPatch = PATCH_TYPE.__initial__;
  }
}

export interface CustomRenderDispatchDev extends CustomRenderDispatch {
  __hmr_runtime__: HMR;
  __hmr_remount__: (cb?: () => void) => void;
}
