import type { createContext, MyReactElementNode } from "../element";
import type { MyReactFiberNode } from "../fiber";
import type { CreateHookParams } from "../hook";
import type { RenderScope } from "../scope";
import type { LinkTreeList } from "@my-react/react-shared";

export interface FiberDispatch {
  suspenseMap: Record<string, MyReactElementNode>;

  strictMap: Record<string, boolean>;

  scopeIdMap: Record<string, string | null>;

  errorBoundariesMap: Record<string, MyReactFiberNode | null>;

  keepLiveMap: Record<string, MyReactFiberNode[]>;

  effectMap: Record<string, Array<() => void>>;

  layoutEffectMap: Record<string, Array<() => void>>;

  contextMap: Record<string, Record<string, MyReactFiberNode>>;

  deactivatedMap: Record<string, LinkTreeList<MyReactFiberNode>[]>;

  unmountMap: Record<string, LinkTreeList<MyReactFiberNode>[]>;

  eventMap: Record<string, Record<string, ((...args: any[]) => void) & { cb?: any[] }>>;

  triggerUpdate(_fiber: MyReactFiberNode): void;

  triggerError(_fiber: MyReactFiberNode, _error: Error): void;

  resolveLazyElement(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveLazyElementAsync(_fiber: MyReactFiberNode): Promise<MyReactElementNode>;

  resolveHook(_fiber: MyReactFiberNode | null, _hookParams: CreateHookParams): any | null;

  resolveKeepLiveMap(_fiber: MyReactFiberNode): void;

  resolveKeepLive(_fiber: MyReactFiberNode, _element: MyReactElementNode): MyReactFiberNode | null;

  resolveElementTypeMap(_fiber: MyReactFiberNode): void;

  resolveStrictMap(_fiber: MyReactFiberNode): void;

  resolveScopeId(_fiber: MyReactFiberNode): string;

  resolveScopeIdMap(_fiber: MyReactFiberNode): void;

  resolveStrictValue(_fiber: MyReactFiberNode): boolean;

  resolveSuspenseMap(_fiber: MyReactFiberNode): void;

  resolveErrorBoundaries(_fiber: MyReactFiberNode): MyReactFiberNode | null;

  resolveErrorBoundariesMap(_fiber: MyReactFiberNode): void;

  resolveSuspenseElement(_fiber: MyReactFiberNode): MyReactElementNode;

  resolveContextMap(_fiber: MyReactFiberNode): void;

  resolveContextFiber(_fiber: MyReactFiberNode, _contextObject: ReturnType<typeof createContext> | null): null | MyReactFiberNode;

  resolveContextValue(_fiber: MyReactFiberNode | null, _contextObject: ReturnType<typeof createContext> | null): Record<string, unknown> | null;

  resolveComponentQueue(_fiber: MyReactFiberNode): void;

  resolveHookQueue(_fiber: MyReactFiberNode): void;

  resolveFiberUpdate(_fiber: MyReactFiberNode): void;

  resolveMemorizedProps(_fiber: MyReactFiberNode): void;

  // loop to mount/hydrate
  reconcileCommit(_fiber: MyReactFiberNode, _hydrate: boolean, _parentFiberWithDom: MyReactFiberNode): boolean;

  // loop to update
  reconcileUpdate(_list: LinkTreeList<MyReactFiberNode>): void;

  beginProgressList(_scope: RenderScope): void;

  endProgressList(_scope: RenderScope): void;

  generateUpdateList(_fiber: MyReactFiberNode, _scope: RenderScope): void;

  pendingCreate(_fiber: MyReactFiberNode): void;

  pendingUpdate(_fiber: MyReactFiberNode): void;

  pendingAppend(_fiber: MyReactFiberNode): void;

  pendingContext(_fiber: MyReactFiberNode): void;

  pendingPosition(_fiber: MyReactFiberNode): void;

  pendingDeactivate(_fiber: MyReactFiberNode): void;

  pendingRef(_fiber: MyReactFiberNode): void;

  pendingUnmount(_fiber: MyReactFiberNode, _pendingUnmount: MyReactFiberNode | MyReactFiberNode[] | Array<MyReactFiberNode | MyReactFiberNode[]>): void;

  pendingLayoutEffect(_fiber: MyReactFiberNode, _layoutEffect: () => void): void;

  pendingEffect(_fiber: MyReactFiberNode, _effect: () => void): void;

  removeFiber(_fiber: MyReactFiberNode): void;
}
