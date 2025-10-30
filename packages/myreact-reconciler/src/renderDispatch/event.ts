/* eslint-disable max-lines */
import {
  __my_react_internal__,
  type lazy,
  type createContext,
  type MyReactComponent,
  type MyReactElementNode,
  type UpdateQueue,
  type RenderHookParams,
  type MyReactInternalInstance,
} from "@my-react/react";

import { initSuspenseInstance } from "../processSuspense";
import { triggerUpdateOnFiber, type MyReactFiberNode } from "../runtimeFiber";
import { initInstance, initVisibleInstance } from "../runtimeGenerate";
import { MyWeakMap, NODE_TYPE } from "../share";

import type { CustomRenderDispatch } from "./instance";
import type { PromiseWithState } from "../processPromise";
import type { RenderDispatch } from "./interface";
import type { UpdateState } from "../processQueue";
import type { MyReactHookNode } from "../runtimeHook";
import type { ListTree, STATE_TYPE, UniqueArray } from "@my-react/react-shared";

const { Dispatcher, MyReactInternalInstance: MyReactInternalInstanceClass, dispatchToListenerMap } = __my_react_internal__;

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
  performanceWarn?: Set<(fiber: MyReactFiberNode, renderTime: number) => void>;
  beforeFiberRun?: Set<(fiber: MyReactFiberNode) => void>;
  afterFiberRun?: Set<(fiber: MyReactFiberNode) => void>;
  afterFiberDone?: Set<(fiber: MyReactFiberNode) => void>;

  instanceInitial: Set<(instance: MyReactComponent, fiber: MyReactFiberNode) => void>;
  instanceUpdate: Set<(instance: MyReactComponent, fiber: MyReactFiberNode) => void>;
  instanceState: Set<(instance: MyReactComponent, fiber: MyReactFiberNode, updater: UpdateQueue) => void>;
  instanceUnmount: Set<(instance: MyReactComponent, fiber: MyReactFiberNode) => void>;

  hookInitial: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode) => void>;
  hookUpdate: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode) => void>;
  hookState: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode, updater: UpdateQueue) => void>;
  hookUnmount: Set<(hook: MyReactHookNode, fiber: MyReactFiberNode) => void>;

  beforeDispatchRender?: Set<(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => void>;
  afterDispatchRender?: Set<(renderDispatch: CustomRenderDispatch) => void>;
  beforeDispatchUpdate?: Set<(renderDispatch: CustomRenderDispatch, list: Array<MyReactFiberNode>) => void>;
  afterDispatchUpdate?: Set<(renderDispatch: CustomRenderDispatch) => void>;

  beforeCommitMount: Set<(renderDispatch: CustomRenderDispatch) => void>;
  afterCommitMount: Set<(renderDispatch: CustomRenderDispatch) => void>;
  beforeCommitUpdate: Set<(renderDispatch: CustomRenderDispatch) => void>;
  afterCommitUpdate: Set<(renderDispatch: CustomRenderDispatch) => void>;
  beforeCommitUnmount: Set<(renderDispatch: CustomRenderDispatch) => void>;
  afterCommitUnmount: Set<(renderDispatch: CustomRenderDispatch) => void>;
};

const getInitialListeners = (): Listeners => {
  return __DEV__
    ? {
        fiberInitial: new Set(),
        fiberUpdate: new Set(),
        fiberHasChange: new Set(),
        fiberUnmount: new Set(),
        fiberHMR: new Set(),
        beforeFiberRun: new Set(),
        afterFiberRun: new Set(),
        afterFiberDone: new Set(),
        beforeDispatchRender: new Set(),
        afterDispatchRender: new Set(),
        beforeDispatchUpdate: new Set(),
        afterDispatchUpdate: new Set(),
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
        beforeCommitMount: new Set(),
        afterCommitMount: new Set(),
        beforeCommitUpdate: new Set(),
        afterCommitUpdate: new Set(),
        beforeCommitUnmount: new Set(),
        afterCommitUnmount: new Set(),
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
        beforeCommitMount: new Set(),
        afterCommitMount: new Set(),
        beforeCommitUpdate: new Set(),
        afterCommitUpdate: new Set(),
        beforeCommitUnmount: new Set(),
        afterCommitUnmount: new Set(),
      };
};

const getInitialMap = (): RenderDispatch["runtimeMap"] => ({
  effectMap: new MyWeakMap(),

  layoutEffectMap: new MyWeakMap(),

  insertionEffectMap: new MyWeakMap(),

  unmountMap: new MyWeakMap(),

  eventMap: new MyWeakMap(),

  triggerCallbackMap: new MyWeakMap(),
});

const getInitialFiber = (): RenderDispatch["runtimeFiber"] => ({
  scheduledFiber: null,

  errorCatchFiber: null,

  nextWorkingFiber: null,

  retriggerFiber: null,
});

const initialRef: RenderDispatch["runtimeRef"] = {
  typeForRef: NODE_TYPE.__plain__ | NODE_TYPE.__class__,

  typeForCreate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,

  typeForUpdate: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForAppend: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__comment__,

  typeForNativeNode: NODE_TYPE.__text__ | NODE_TYPE.__plain__ | NODE_TYPE.__portal__ | NODE_TYPE.__comment__,
};

const listenerMap = dispatchToListenerMap as Map<MyReactInternalInstance, Listeners>;

export class RenderDispatchEvent extends MyReactInternalInstanceClass implements RenderDispatch {
  runtimeMap: RenderDispatch["runtimeMap"];

  runtimeRef: RenderDispatch["runtimeRef"];

  runtimeFiber: RenderDispatch["runtimeFiber"];

  dispatcher = Dispatcher;

  rootNode: any;

  rootFiber: MyReactFiberNode;

  rootElement: MyReactElementNode;

  isAppMounted: boolean;

  isAppCrashed: boolean;

  isAppUnmounted: boolean;

  pendingCommitFiberList: ListTree<MyReactFiberNode>;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode>;

  pendingSuspenseFiberArray: UniqueArray<MyReactFiberNode>;

  constructor() {
    super();

    this.runtimeRef = initialRef;

    this.runtimeMap = getInitialMap();

    this.runtimeFiber = getInitialFiber();

    listenerMap.set(this, getInitialListeners());

    initInstance(this);

    initVisibleInstance(this);

    initSuspenseInstance(this);

    Object.defineProperty(this, "dispatcher", {
      value: Dispatcher,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  getFiberTree(_fiber: MyReactFiberNode): string {
    throw new Error("Method not implemented.");
  }
  readPromise(_params: Promise<unknown>): unknown {
    throw new Error("Method not implemented.");
  }
  readContext(_params: ReturnType<typeof createContext>): unknown {
    throw new Error("Method not implemented.");
  }
  dispatchHook(_params: RenderHookParams): unknown {
    throw new Error("Method not implemented.");
  }
  dispatchState(_params: UpdateQueue): void {
    throw new Error("Method not implemented.");
  }
  dispatchError(_params: { fiber?: MyReactFiberNode; error?: Error }): MyReactElementNode {
    throw new Error("Method not implemented.");
  }
  dispatchPromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    throw new Error("Method not implemented.");
  }
  dispatchSuspensePromise(_params: { fiber?: MyReactFiberNode; promise?: Promise<unknown> }): MyReactElementNode {
    throw new Error("Method not implemented.");
  }

  trigger(_fiber: MyReactFiberNode, _state?: STATE_TYPE, cb?: () => void) {
    return triggerUpdateOnFiber(_fiber, _state, cb);
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

  processLazy(_elementType: ReturnType<typeof lazy>): Promise<void> {
    return Promise.resolve();
  }

  processPromise(_promise: PromiseWithState<unknown>): Promise<void> {
    return Promise.resolve();
  }

  commitCreate(_fiber: MyReactFiberNode): void {}

  commitUpdate(_fiber: MyReactFiberNode): void {}

  commitAppend(_fiber: MyReactFiberNode): void {}

  commitPosition(_fiber: MyReactFiberNode): void {}

  commitSetRef(_fiber: MyReactFiberNode): void {}

  commitUnsetRef(_fiber: MyReactFiberNode): void {}

  commitClear(_fiber: MyReactFiberNode): void {}

  resolveStrict(_fiber: MyReactFiberNode): boolean {
    return false;
  }

  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return null;
  }

  resolveSuspenseValue(_fiber: MyReactFiberNode): MyReactElementNode {
    return null;
  }

  resolveSuspenseFiber(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return null;
  }

  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null {
    return null;
  }

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

  resetYield(): void {
    void 0;
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

  callOnFiberInitial(_fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).fiberInitial;

    set?.forEach?.((cb) => cb(_fiber));
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

  callOnFiberUpdate(_fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).fiberUpdate;

    set?.forEach?.((cb) => cb(_fiber));
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

  callOnFiberChange(_list: ListTree<MyReactFiberNode>) {
    const set = listenerMap.get(this).fiberHasChange;

    set?.forEach?.((cb) => cb(_list));
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

  callOnFiberUnmount(_fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).fiberUnmount;

    set?.forEach?.((cb) => cb(_fiber));
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

  callOnFiberState(_fiber: MyReactFiberNode, _updater: UpdateQueue) {
    const set = listenerMap.get(this).fiberState;

    set?.forEach?.((cb) => cb(_fiber, _updater));
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

  callOnFiberTrigger(_fiber: MyReactFiberNode, _state: UpdateState) {
    const set = listenerMap.get(this).fiberTrigger;

    set?.forEach?.((cb) => cb(_fiber, _state));
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

  callOnFiberHMR(_fiber: MyReactFiberNode, _forceRefresh?: boolean) {
    const set = listenerMap.get(this).fiberHMR;

    set?.forEach?.((cb) => cb(_fiber, _forceRefresh));
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

  callOnFiberWarn(_fiber: MyReactFiberNode, ...args: any) {
    const set = listenerMap.get(this).fiberWarn;

    set?.forEach?.((cb) => cb(_fiber, ...args));
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

  callOnFiberError(_fiber: MyReactFiberNode, ...args: any) {
    const set = listenerMap.get(this).fiberError;

    set?.forEach?.((cb) => cb(_fiber, ...args));
  }

  onPerformanceWarn(cb: (_fiber: MyReactFiberNode, _renderTime: number) => void) {
    const set = listenerMap.get(this).performanceWarn;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  oncePerformanceWarn(cb: (_fiber: MyReactFiberNode, _renderTime: number) => void) {
    const set = listenerMap.get(this).performanceWarn;

    const onceCb = (_fiber: MyReactFiberNode, _renderTime: number) => {
      cb(_fiber, _renderTime);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  callOnPerformanceWarn(_fiber: MyReactFiberNode, _renderTime: number) {
    const set = listenerMap.get(this).performanceWarn;

    set?.forEach?.((cb) => cb(_fiber, _renderTime));
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

  callOnBeforeFiberRun(_fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).beforeFiberRun;

    set?.forEach?.((cb) => cb(_fiber));
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

  callOnAfterFiberRun(_fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).afterFiberRun;

    set?.forEach?.((cb) => cb(_fiber));
  }

  onAfterFiberDone(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).afterFiberDone;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceAfterFiberDone(cb: (_fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).afterFiberDone;

    const onceCb = (_fiber: MyReactFiberNode) => {
      cb(_fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  callOnAfterFiberDone(_fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).afterFiberDone;

    set?.forEach?.((cb) => cb(_fiber));
  }

  onBeforeDispatchRender(cb: (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).beforeDispatchRender;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceBeforeDispatchRender(cb: (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).beforeDispatchRender;

    const onceCb = (renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) => {
      cb(renderDispatch, fiber);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  callOnBeforeDispatchRender(renderDispatch: CustomRenderDispatch, fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).beforeDispatchRender;

    set?.forEach?.((cb) => cb(renderDispatch, fiber));
  }

  onAfterDispatchRender(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterDispatchRender;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceAfterDispatchRender(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterDispatchRender;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  callOnAfterDispatchRender(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).afterDispatchRender;

    set?.forEach?.((cb) => cb(renderDispatch));
  }

  onBeforeDispatchUpdate(cb: (renderDispatch: CustomRenderDispatch, list: Array<MyReactFiberNode>) => void) {
    const set = listenerMap.get(this).beforeDispatchUpdate;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceBeforeDispatchUpdate(cb: (renderDispatch: CustomRenderDispatch, list: Array<MyReactFiberNode>) => void) {
    const set = listenerMap.get(this).beforeDispatchUpdate;

    const onceCb = (renderDispatch: CustomRenderDispatch, list: Array<MyReactFiberNode>) => {
      cb(renderDispatch, list);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  callOnBeforeDispatchUpdate(renderDispatch: CustomRenderDispatch, list: Array<MyReactFiberNode>) {
    const set = listenerMap.get(this).beforeDispatchUpdate;

    set?.forEach?.((cb) => cb(renderDispatch, list));
  }

  onAfterDispatchUpdate(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterDispatchUpdate;

    set?.add?.(cb);

    return () => set?.delete?.(cb);
  }

  onceAfterDispatchUpdate(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterDispatchUpdate;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set?.delete?.(onceCb);
    };

    set?.add?.(onceCb);
  }

  callOnAfterDispatchUpdate(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).afterDispatchUpdate;

    set?.forEach?.((cb) => cb(renderDispatch));
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

  callOnInstanceInitial(_instance: MyReactComponent, _fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).instanceInitial;

    set?.forEach?.((cb) => cb(_instance, _fiber));
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

  callOnInstanceUpdate(_instance: MyReactComponent, _fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).instanceUpdate;

    set?.forEach?.((cb) => cb(_instance, _fiber));
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

  callOnInstanceState(_instance: MyReactComponent, _fiber: MyReactFiberNode, _updater: UpdateQueue) {
    const set = listenerMap.get(this).instanceState;

    set?.forEach?.((cb) => cb(_instance, _fiber, _updater));
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

  callOnInstanceUnmount(_instance: MyReactComponent, _fiber: MyReactFiberNode) {
    const set = listenerMap.get(this).instanceUnmount;

    set?.forEach?.((cb) => cb(_instance, _fiber));
  }

  onHookInitial(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).hookInitial;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookInitial(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).hookInitial;

    const onceCb = (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => {
      cb(_hook, _fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnHookInitial(_hook: MyReactHookNode, _fiber?: MyReactFiberNode) {
    const set = listenerMap.get(this).hookInitial;

    set?.forEach?.((cb) => cb(_hook, _fiber));
  }

  onHookUpdate(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).hookUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookUpdate(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).hookUpdate;

    const onceCb = (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => {
      cb(_hook, _fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnHookUpdate(_hook: MyReactHookNode, _fiber?: MyReactFiberNode) {
    const set = listenerMap.get(this).hookUpdate;

    set?.forEach?.((cb) => cb(_hook, _fiber));
  }

  onHookUnmount(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).hookUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceHookUnmount(cb: (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => void) {
    const set = listenerMap.get(this).hookUnmount;

    const onceCb = (_hook: MyReactHookNode, _fiber: MyReactFiberNode) => {
      cb(_hook, _fiber);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnHookUnmount(_hook: MyReactHookNode, _fiber?: MyReactFiberNode) {
    const set = listenerMap.get(this).hookUnmount;

    set?.forEach?.((cb) => cb(_hook, _fiber));
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

  callOnHookState(_hook: MyReactHookNode, _fiber: MyReactFiberNode, _updater: UpdateQueue) {
    const set = listenerMap.get(this).hookState;

    set?.forEach?.((cb) => cb(_hook, _fiber, _updater));
  }

  onBeforeCommitMount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).beforeCommitMount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceBeforeCommitMount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).beforeCommitMount;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnBeforeCommitMount(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).beforeCommitMount;

    set?.forEach?.((cb) => cb(renderDispatch));
  }

  onAfterCommitMount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterCommitMount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceAfterCommitMount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterCommitMount;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnAfterCommitMount(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).afterCommitMount;

    set?.forEach?.((cb) => cb(renderDispatch));
  }

  onBeforeCommitUpdate(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).beforeCommitUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceBeforeCommitUpdate(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).beforeCommitUpdate;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnBeforeCommitUpdate(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).beforeCommitUpdate;

    set?.forEach?.((cb) => cb(renderDispatch));
  }

  onAfterCommitUpdate(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterCommitUpdate;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceAfterCommitUpdate(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterCommitUpdate;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnAfterCommitUpdate(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).afterCommitUpdate;

    set?.forEach?.((cb) => cb(renderDispatch));
  }

  onBeforeCommitUnmount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).beforeCommitUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceBeforeCommitUnmount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).beforeCommitUnmount;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnBeforeCommitUnmount(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).beforeCommitUnmount;

    set?.forEach?.((cb) => cb(renderDispatch));
  }

  onAfterCommitUnmount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterCommitUnmount;

    set.add(cb);

    return () => set.delete(cb);
  }

  onceAfterCommitUnmount(cb: (renderDispatch: CustomRenderDispatch) => void) {
    const set = listenerMap.get(this).afterCommitUnmount;

    const onceCb = (renderDispatch: CustomRenderDispatch) => {
      cb(renderDispatch);

      set.delete(onceCb);
    };

    set.add(onceCb);
  }

  callOnAfterCommitUnmount(renderDispatch: CustomRenderDispatch) {
    const set = listenerMap.get(this).afterCommitUnmount;

    set?.forEach?.((cb) => cb(renderDispatch));
  }
}
