import type { CustomRenderPlatform } from "../renderPlatform";
import type { MyReactFiberNode } from "../runtimeFiber";
import type { NODE_TYPE } from "../share";
import type { createContext, MyReactElementNode } from "@my-react/react";
import type { ListTree, UniqueArray } from "@my-react/react-shared";

export type refKey = "typeForRef" | "typeForCreate" | "typeForUpdate" | "typeForAppend" | "typeForNativeNode";

export type RuntimeMap = {
  suspenseMap: WeakMap<MyReactFiberNode, MyReactElementNode>;

  strictMap: WeakMap<MyReactFiberNode, boolean>;

  useIdMap: WeakMap<MyReactFiberNode, { initial: number; latest: number }>;

  scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode>;

  errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode>;

  effectMap: WeakMap<MyReactFiberNode, (() => void)[]>;

  layoutEffectMap: WeakMap<MyReactFiberNode, (() => void)[]>;

  insertionEffectMap: WeakMap<MyReactFiberNode, (() => void)[]>;

  contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>>;

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>[]>;

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any[] }>>;
};

export type fiberKey = "scheduledFiber" | "errorCatchFiber" | "nextWorkingFiber";

type DefaultRenderDispatch = {
  runtimeRef: Record<refKey, NODE_TYPE>;

  runtimeMap: RuntimeMap;

  runtimeFiber: Record<fiberKey, MyReactFiberNode>;

  rootNode: any;

  rootFiber: MyReactFiberNode;

  renderPlatform: CustomRenderPlatform;

  isAppMounted: boolean;

  isAppCrashed: boolean;

  pendingCommitFiberList: ListTree<MyReactFiberNode> | null;

  pendingUpdateFiberArray: UniqueArray<MyReactFiberNode>;

  generateCommitList(_fiber: MyReactFiberNode): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingContext(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingRef(_fiber: MyReactFiberNode): void;

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void;

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void;

  pendingInsertionEffect(_fiber: MyReactFiberNode, _insertionEffect: () => void): void;

  patchToFiberInitial?: (_fiber: MyReactFiberNode) => void;

  patchToFiberUpdate?: (_fiber: MyReactFiberNode) => void;

  patchToFiberUnmount?: (_fiber: MyReactFiberNode) => void;

  commitCreate(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean;

  commitUpdate(_fiber: MyReactFiberNode, _hydrate?: boolean): void;

  commitAppend(_fiber: MyReactFiberNode): void;

  commitPosition(_fiber: MyReactFiberNode): void;

  commitSetRef(_fiber: MyReactFiberNode): void;

  commitUnsetRef(_fiber: MyReactFiberNode): void;

  commitClearNode(_fiber: MyReactFiberNode): void;

  resolveLazyElementSync(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode>;

  resolveStrictMap(_fiber: MyReactFiberNode): void;

  resolveStrict(_fiber: MyReactFiberNode): boolean;

  resolveUseIdMap(_fiber: MyReactFiberNode): void;

  resolveUseId(_fiber: MyReactFiberNode): string;

  resolveScopeMap(_fiber: MyReactFiberNode): void;

  resolveScope(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveSuspenseMap(_fiber: MyReactFiberNode): void;

  resolveSuspense(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void;

  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveContextMap(_fiber: MyReactFiberNode): void;

  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): null | MyReactFiberNode;

  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null;

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate?: boolean): boolean;

  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void;

  shouldYield(): boolean;
};

export type RenderDispatch<T = Record<string, any>> = DefaultRenderDispatch & T;
