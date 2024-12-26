import type { MyReactFiberNode } from "../runtimeFiber";
import type { NODE_TYPE } from "../share";
import type { createContext, MyReactElementNode } from "@my-react/react";
import type { ListTree, UniqueArray } from "@my-react/react-shared";

export type refKey = "typeForRef" | "typeForCreate" | "typeForUpdate" | "typeForAppend" | "typeForNativeNode";

export type RuntimeMap = {
  suspenseMap: WeakMap<MyReactFiberNode, MyReactFiberNode>;

  strictMap: WeakMap<MyReactFiberNode, boolean>;

  scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode>;

  errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode>;

  effectMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;

  layoutEffectMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;

  insertionEffectMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;

  contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>>;

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>;

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any }>>;
};

export type fiberKey = "scheduledFiber" | "errorCatchFiber" | "nextWorkingFiber";

type DefaultRenderDispatch = {
  runtimeRef: Record<refKey, NODE_TYPE>;

  runtimeMap: RuntimeMap;

  runtimeFiber: Record<fiberKey, MyReactFiberNode>;

  rootNode: any;

  rootFiber: MyReactFiberNode;

  isAppMounted: boolean;

  isAppCrashed: boolean;

  isAppUnmounted: boolean;

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null;

  pendingAsyncLoadFiberList: ListTree<MyReactFiberNode> | null;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode>;

  generateCommitList(_fiber: MyReactFiberNode): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingRef(_fiber: MyReactFiberNode): void;

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void, _option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void;

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void, _option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void;

  pendingInsertionEffect(_fiber: MyReactFiberNode, _insertionEffect: () => void, _option?: { stickyToHead?: boolean; stickyToFoot?: boolean }): void;

  /**
   * @deprecated
   */
  patchToFiberInitial?: (_fiber: MyReactFiberNode) => void;

  /**
   * @deprecated
   */
  patchToFiberUpdate?: (_fiber: MyReactFiberNode) => void;

  /**
   * @deprecated
   */
  patchToFiberUnmount?: (_fiber: MyReactFiberNode) => void;

  onFiberInitial?: (cb: (_fiber: MyReactFiberNode) => void) => () => void;

  onceFiberInitial?: (cb: (_fiber: MyReactFiberNode) => void) => void;

  onFiberUpdate?: (cb: (_fiber: MyReactFiberNode) => void) => () => void;

  onceFiberUpdate?: (cb: (_fiber: MyReactFiberNode) => void) => void;

  onFiberUnmount?: (cb: (_fiber: MyReactFiberNode) => void) => () => void;

  onceFiberUnmount?: (cb: (_fiber: MyReactFiberNode) => void) => void;

  /**
   * @deprecated
   */
  beforeCommit?: () => void;

  onBeforeCommit?: (cb: () => void) => () => void;

  onceBeforeCommit?: (cb: () => void) => void;

  /**
   * @deprecated
   */
  afterCommit?: () => void;

  onAfterCommit?: (cb: () => void) => () => void;

  onceAfterCommit?: (cb: () => void) => void;

  /**
   * @deprecated
   */
  beforeUpdate?: () => void;

  onBeforeUpdate?: (cb: () => void) => () => void;

  onceBeforeUpdate?: (cb: () => void) => void;

  /**
   * @deprecated
   */
  afterUpdate?: () => void;

  onAfterUpdate?: (cb: () => void) => () => void;

  onceAfterUpdate?: (cb: () => void) => void;

  /**
   * @deprecated
   */
  beforeUnmount?: () => void;

  onBeforeUnmount?: (cb: () => void) => () => void;

  onceBeforeUnmount?: (cb: () => void) => void;

  /**
   * @deprecated
   */
  afterUnmount?: () => void;

  onAfterUnmount?: (cb: () => void) => () => void;

  onceAfterUnmount?: (cb: () => void) => void;

  dispatchFiber(_fiber: MyReactFiberNode): void;

  processFiber(_fiber: MyReactFiberNode): Promise<void>;

  commitCreate(_fiber: MyReactFiberNode): void;

  commitUpdate(_fiber: MyReactFiberNode): void;

  commitAppend(_fiber: MyReactFiberNode): void;

  commitPosition(_fiber: MyReactFiberNode): void;

  commitSetRef(_fiber: MyReactFiberNode): void;

  commitUnsetRef(_fiber: MyReactFiberNode): void;

  commitClear(_fiber: MyReactFiberNode): void;

  resolveStrictMap(_fiber: MyReactFiberNode): void;

  resolveStrict(_fiber: MyReactFiberNode): boolean;

  resolveScopeMap(_fiber: MyReactFiberNode): void;

  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveSuspenseMap(_fiber: MyReactFiberNode): void;

  resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void;

  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveContextMap(_fiber: MyReactFiberNode): void;

  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): null | MyReactFiberNode;

  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null;

  reconcileCommit(_fiber: MyReactFiberNode): void;

  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void;

  reconcileUnmount(): void;

  shouldYield(): boolean;
};

export type RenderDispatch<T = Record<string, any>> = DefaultRenderDispatch & T;
