import type { MyReactFiberNode, triggerUpdateOnFiber } from "../runtimeFiber";
import type { NODE_TYPE } from "../share";
import type { createContext, MyReactElementNode, RenderPlatform } from "@my-react/react";
import type { ListTree, UniqueArray } from "@my-react/react-shared";

type RefKey = "typeForRef" | "typeForCreate" | "typeForUpdate" | "typeForAppend" | "typeForNativeNode";

type RuntimeMap = {
  effectMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;

  layoutEffectMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;

  insertionEffectMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>>;

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any }>>;

  triggerCallbackMap: WeakMap<MyReactFiberNode, ListTree<() => void>>;
};

type FiberKey = "scheduledFiber" | "errorCatchFiber" | "nextWorkingFiber";

type DefaultRenderDispatch = {
  runtimeRef: Record<RefKey, NODE_TYPE>;

  runtimeMap: RuntimeMap;

  runtimeFiber: Record<FiberKey, MyReactFiberNode>;

  rootNode: any;

  rootFiber: MyReactFiberNode;

  rootElement: MyReactElementNode;

  dispatcher: RenderPlatform["dispatcher"];

  trigger: typeof triggerUpdateOnFiber;

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

  resolveStrict(_fiber: MyReactFiberNode): boolean;

  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveSuspenseFiber(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveSuspenseValue(_fiber: MyReactFiberNode): MyReactElementNode | null;

  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): null | MyReactFiberNode;

  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null;

  reconcileCommit(_fiber: MyReactFiberNode): void;

  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void;

  reconcileUnmount(): void;

  shouldYield(): boolean;
};

export type RenderDispatch<T = Record<string, any>> = DefaultRenderDispatch & T;
