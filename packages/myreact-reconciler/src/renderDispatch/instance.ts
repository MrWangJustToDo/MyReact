import { PATCH_TYPE, ListTree, UniqueArray, include, merge, exclude } from "@my-react/react-shared";

import { defaultGenerateContextMap, /*  defaultGetContextFiber, */ defaultGetContextFiber_New, defaultGetContextValue } from "../dispatchContext";
import { defaultGenerateEffectMap } from "../dispatchEffect";
import { defaultGenerateErrorBoundariesMap, defaultResolveErrorBoundaries } from "../dispatchErrorBoundaries";
import { defaultDispatchMount } from "../dispatchMount";
import { defaultGenerateScopeMap } from "../dispatchScope";
import { defaultGenerateStrict, defaultGenerateStrictMap } from "../dispatchStrict";
import { defaultGenerateSuspenseMap, defaultResolveSuspense } from "../dispatchSuspense";
import { defaultGenerateUnmountMap } from "../dispatchUnmount";
import { defaultDispatchUpdate } from "../dispatchUpdate";
import { MyWeakMap, NODE_TYPE, onceWarnWithKeyAndFiber } from "../share";

import type { fiberKey, refKey, RenderDispatch, RuntimeMap } from "./interface";
import type { MyReactFiberContainer, MyReactFiberNode } from "../runtimeFiber";
import type { createContext, MyReactElementNode } from "@my-react/react";

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

  pendingAsyncLoadFiberList: ListTree<MyReactFiberNode> | null = null;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode> = new UniqueArray<MyReactFiberNode>();

  performanceLogTimeLimit = 2000;

  uniqueIdCount = 0;

  beforeCommit?: () => void;

  afterCommit?: () => void;

  beforeUpdate?: () => void;

  afterUpdate?: () => void;

  beforeUnmount?: () => void;

  afterUnmount?: () => void;

  constructor(
    readonly rootNode: any,
    readonly rootFiber: MyReactFiberNode
  ) {
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
  patchToFiberInitial(_fiber: MyReactFiberNode) {
    void 0;
  }
  patchToFiberUpdate(_fiber: MyReactFiberNode) {
    void 0;
  }
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
  commitClearNode(_fiber: MyReactFiberNode): void {
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
    this.beforeCommit?.();

    defaultDispatchMount(_fiber, this);

    this.afterCommit?.();
  }
  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {
    this.beforeUpdate?.();

    defaultDispatchUpdate(_list, this);

    this.afterUpdate?.();
  }
  shouldYield(): boolean {
    return false;
  }
  resetUpdateFlowRuntimeFiber(): void {
    this.runtimeFiber.scheduledFiber = null;

    this.runtimeFiber.nextWorkingFiber = null;
  }
}
