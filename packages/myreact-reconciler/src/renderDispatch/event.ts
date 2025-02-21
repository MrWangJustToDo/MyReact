/* eslint-disable max-lines */
import type { NODE_TYPE } from "../share";
import type { fiberKey, refKey, RenderDispatch, RuntimeMap } from "./interface";
import type { UpdateState } from "../processQueue";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { MyReactHookNode } from "../runtimeHook";
import type { createContext, MyReactComponent, MyReactElementNode, UpdateQueue } from "@my-react/react";
import type { ListTree, UniqueArray } from "@my-react/react-shared";

type Listeners = {
  fiberInitial: Set<(fiber: MyReactFiberNode) => void>;
  fiberUpdate: Set<(fiber: MyReactFiberNode) => void>;
  fiberState: Set<(fiber: MyReactFiberNode, updater: UpdateQueue) => void>;
  fiberTrigger: Set<(fiber: MyReactFiberNode, state: UpdateState) => void>;
  fiberUnmount: Set<(fiber: MyReactFiberNode) => void>;
  fiberHMR?: Set<(fiber: MyReactFiberNode, forceRefresh?: boolean) => void>;
  fiberWarn?: Set<(fiber: MyReactFiberNode, ...args: any) => void>;
  fiberError?: Set<(fiber: MyReactFiberNode, ...args: any) => void>;
  fiberHasChange: Set<(list: ListTree<MyReactFiberNode>) => void>;
  performanceWarn?: Set<(fiber: MyReactFiberNode) => void>;
  beforeFiberRun?: Set<(fiber: MyReactFiberNode) => void>;
  afterFiberRun?: Set<(fiber: MyReactFiberNode) => void>;

  instanceInitial: Set<(instance: MyReactComponent, fiber: MyReactFiberNode) => void>;
  instanceUpdate: Set<(instance: MyReactComponent, fiber: MyReactFiberNode) => void>;
  instanceState: Set<(instance: MyReactComponent, fiber: MyReactFiberNode, updater: UpdateQueue) => void>;
  instanceUnmount: Set<(instance: MyReactComponent, fiber: MyReactFiberNode) => void>;

  hookInitial: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode) => void>;
  hookUpdate: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode) => void>;
  hookState: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode, updater: UpdateQueue) => void>;
  hookUnmount: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode) => void>;

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
        fiberHasChange: new Set(),
        fiberUnmount: new Set(),
        fiberHMR: new Set(),
        beforeFiberRun: new Set(),
        afterFiberRun: new Set(),
        fiberWarn: new Set(),
        fiberError: new Set(),
        fiberState: new Set(),
        fiberTrigger: new Set(),
        performanceWarn: new Set(),
        instanceInitial: new Set(),
        instanceUpdate: new Set(),
        instanceState: new Set(),
        instanceUnmount: new Set(),
        hookInitial: new Set(),
        hookUpdate: new Set(),
        hookState: new Set(),
        hookUnmount: new Set(),
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
        fiberHasChange: new Set(),
        fiberUnmount: new Set(),
        fiberState: new Set(),
        fiberTrigger: new Set(),
        instanceInitial: new Set(),
        instanceUpdate: new Set(),
        instanceState: new Set(),
        instanceUnmount: new Set(),
        hookInitial: new Set(),
        hookUpdate: new Set(),
        hookState: new Set(),
        hookUnmount: new Set(),
        beforeCommit: new Set(),
        afterCommit: new Set(),
        beforeUpdate: new Set(),
        afterUpdate: new Set(),
        beforeUnmount: new Set(),
        afterUnmount: new Set(),
      };
};

export const listenerMap = new Map<RenderDispatch, Listeners>();

export class RenderDispatchEvent implements RenderDispatch {
  runtimeRef: Record<refKey, NODE_TYPE>;

  runtimeMap: RuntimeMap;

  runtimeFiber: Record<fiberKey, MyReactFiberNode>;

  rootNode: any;

  rootFiber: MyReactFiberNode;

  isAppMounted: boolean;

  isAppCrashed: boolean;

  isAppUnmounted: boolean;

  pendingCommitFiberList: ListTree<MyReactFiberNode>;

  pendingAsyncLoadFiberList: ListTree<MyReactFiberNode>;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode>;

  constructor() {
    listenerMap.set(this, getInitialValue());
  }

  generateCommitList(_fiber: MyReactFiberNode): void {}

  pendingCreate(_fiber: MyReactFiberNode): void {}

  pendingUpdate(_fiber: MyReactFiberNode): void {}

  pendingAppend(_fiber: MyReactFiberNode): void {}

  pendingPosition(_fiber: MyReactFiberNode): void {}

  pendingRef(_fiber: MyReactFiberNode): void {}

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void {}

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void, _option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void {}

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void, _option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void {}

  pendingInsertionEffect(_fiber: MyReactFiberNode, _insertionEffect: () => void, _option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void {}

  dispatchFiber(_fiber: MyReactFiberNode) {}

  processFiber(_fiber: MyReactFiberNode): Promise<void> {
    return Promise.resolve();
  }

  commitCreate(_fiber: MyReactFiberNode): void {}

  commitUpdate(_fiber: MyReactFiberNode): void {}

  commitAppend(_fiber: MyReactFiberNode): void {}

  commitPosition(_fiber: MyReactFiberNode): void {}

  commitSetRef(_fiber: MyReactFiberNode): void {}

  commitUnsetRef(_fiber: MyReactFiberNode): void {}

  commitClear(_fiber: MyReactFiberNode): void {}

  resolveStrictMap(_fiber: MyReactFiberNode): void {}

  resolveStrict(_fiber: MyReactFiberNode): boolean {
    return false;
  }

  resolveScopeMap(_fiber: MyReactFiberNode): void {}

  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return null;
  }

  resolveSuspenseMap(_fiber: MyReactFiberNode): void {}

  resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }

  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void {}

  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return null;
  }

  resolveContextMap(_fiber: MyReactFiberNode): void {}

  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): null | MyReactFiberNode {
    return null;
  }

  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null {
    return null;
  }

  reconcileCommit(_fiber: MyReactFiberNode): void {}

  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void {}

  reconcileUnmount(): void {}

  shouldYield(): boolean {
    return false;
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

  onFiberChange(cb: (_list: ListTree<MyReactFiberNode>) => void) {
    const set = listenerMap.get(this).fiberHasChange;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberChange(cb: (_list: ListTree<MyReactFiberNode>) => void) {
    const set = listenerMap.get(this).fiberHasChange;

    const onceCb = (_list: ListTree<MyReactFiberNode>) => {
      cb(_list);

      set.delete(onceCb);
    };

    set.add(onceCb);
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

  onFiberState(cb: (_fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).fiberState;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberState(cb: (_fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).fiberState;

    const onceCb = (_fiber: MyReactFiberNode, _updater: UpdateQueue) => {
      cb(_fiber, _updater);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onFiberTrigger(cb: (_fiber: MyReactFiberNode, _state: UpdateState) => void) {
    const set = listenerMap.get(this).fiberTrigger;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceFiberTrigger(cb: (_fiber: MyReactFiberNode, _state: UpdateState) => void) {
    const set = listenerMap.get(this).fiberTrigger;

    const onceCb = (_fiber: MyReactFiberNode, _state: UpdateState) => {
      cb(_fiber, _state);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onFiberHMR(cb: (_fiber: MyReactFiberNode, _forceRefresh?: boolean) => void) {
    const set = listenerMap.get(this).fiberHMR;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceFiberHMR(cb: (_fiber: MyReactFiberNode, _forceRefresh?: boolean) => void) {
    const set = listenerMap.get(this).fiberHMR;

    const onceCb = (_fiber: MyReactFiberNode, _forceRefresh?: boolean) => {
      cb(_fiber, _forceRefresh);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onFiberWarn(cb: (_fiber: MyReactFiberNode, ...args: any) => void) {
    const set = listenerMap.get(this).fiberWarn;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceFiberWarn(cb: (_fiber: MyReactFiberNode, ...args: any) => void) {
    const set = listenerMap.get(this).fiberWarn;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onFiberError(cb: (_fiber: MyReactFiberNode, ...args: any) => void) {
    const set = listenerMap.get(this).fiberError;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceFiberError(cb: (_fiber: MyReactFiberNode, ...args: any) => void) {
    const set = listenerMap.get(this).fiberError;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onPerformanceWarn(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).performanceWarn;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  oncePerformanceWarn(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).performanceWarn;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onBeforeFiberRun(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).beforeFiberRun;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceBeforeFiberRun(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).beforeFiberRun;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onAfterFiberRun(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).afterFiberRun;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceAfterFiberRun(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).afterFiberRun;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  onInstanceInitial(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).instanceInitial;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceInstanceInitial(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).instanceInitial;

    const onceCb = (_instance: MyReactComponent, _fiber: MyReactFiberNode) => {
      cb(_instance, _fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onInstanceUpdate(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).instanceUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceInstanceUpdate(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).instanceUpdate;

    const onceCb = (_instance: MyReactComponent, _fiber: MyReactFiberNode) => {
      cb(_instance, _fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onInstanceState(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).instanceState;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceInstanceState(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).instanceState;

    const onceCb = (_instance: MyReactComponent, _fiber: MyReactFiberNode, _updater: UpdateQueue) => {
      cb(_instance, _fiber, _updater);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onInstanceUnmount(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).instanceUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceInstanceUnmount(cb: (_instance: MyReactComponent, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).instanceUnmount;

    const onceCb = (_instance: MyReactComponent, _fiber: MyReactFiberNode) => {
      cb(_instance, _fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onHookInitial(cb: (_hook: MyReactHookNode) => void) {
    const set = listenerMap.get(this).hookInitial;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookInitial(cb: (_hook: MyReactHookNode) => void) {
    const set = listenerMap.get(this).hookInitial;

    const onceCb = (_hook: MyReactHookNode) => {
      cb(_hook);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onHookUpdate(cb: (_hook: MyReactHookNode) => void) {
    const set = listenerMap.get(this).hookUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookUpdate(cb: (_hook: MyReactHookNode) => void) {
    const set = listenerMap.get(this).hookUpdate;

    const onceCb = (_hook: MyReactHookNode) => {
      cb(_hook);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onHookUnmount(cb: (_hook: MyReactHookNode) => void) {
    const set = listenerMap.get(this).hookUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookUnmount(cb: (_hook: MyReactHookNode) => void) {
    const set = listenerMap.get(this).hookUnmount;

    const onceCb = (_hook: MyReactHookNode) => {
      cb(_hook);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  onHookState(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).hookState;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookTrigger(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode, _updater: UpdateQueue) => void) {
    const set = listenerMap.get(this).hookState;

    const onceCb = (_hook: MyReactHookNode, _fiber: MyReactFiberNode, _updater: UpdateQueue) => {
      cb(_hook, _fiber, _updater);

      set.delete(onceCb);
    };

    set.add(onceCb);
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
}
