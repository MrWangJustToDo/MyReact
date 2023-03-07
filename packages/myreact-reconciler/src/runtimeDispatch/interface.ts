import type { RenderPlatform } from "../runtimePlatform";
import type { createContext, RenderDispatch as OriginalRenderDispatch, MyReactElementNode, MyReactFiberNode } from "@my-react/react";
import type { ListTree } from "@my-react/react-shared";

export type RenderDispatch = OriginalRenderDispatch<{
  renderPlatform: RenderPlatform;

  suspenseMap: WeakMap<MyReactFiberNode, MyReactElementNode>;

  strictMap: WeakMap<MyReactFiberNode, boolean>;

  scopeMap: WeakMap<MyReactFiberNode, MyReactFiberNode | null>;

  errorBoundariesMap: WeakMap<MyReactFiberNode, MyReactFiberNode | null>;

  effectMap: WeakMap<MyReactFiberNode, Array<() => void>>;

  layoutEffectMap: WeakMap<MyReactFiberNode, Array<() => void>>;

  contextMap: WeakMap<MyReactFiberNode, Record<string, MyReactFiberNode>>;

  unmountMap: WeakMap<MyReactFiberNode, ListTree<MyReactFiberNode>[]>;

  eventMap: WeakMap<MyReactFiberNode, Record<string, ((...args: any[]) => void) & { cb?: any[] }>>;

  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode>;

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

  processFiberUpdate(_fiber: MyReactFiberNode): void;

  processFiberInitial(_fiber: MyReactFiberNode): void;

  processFiberUnmount(_fiber: MyReactFiberNode): void;

  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean): void;

  reconcileUpdate(_list: ListTree<MyReactFiberNode>): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingContext(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingRef(_fiber: MyReactFiberNode): void;

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void;

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void;
}>;
